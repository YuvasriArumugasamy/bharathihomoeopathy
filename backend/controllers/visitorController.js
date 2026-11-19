// backend/controllers/visitorController.js
import crypto from 'crypto';
import SiteVisitorDaily from '../models/SiteVisitorDaily.js';
import { DateTime } from 'luxon'; // npm i luxon for timezone handling

// Helper: get current date/time in IST (Asia/Kolkata)
const getIstDate = () => DateTime.now().setZone('Asia/Kolkata');

/**
 * POST /api/visitors/track
 * Record a page view for an anonymous visitor.
 * If a visitor_key is supplied (>=8 chars) it is used, otherwise a fallback
 * hash of the client IP + User‑Agent is generated.
 */
export const trackVisit = async (req, res) => {
  try {
    let { visitor_key } = req.body ?? {};

    // Fallback: hash of IP + User‑Agent if key missing/invalid
    if (!visitor_key || typeof visitor_key !== 'string' || visitor_key.length < 8) {
      const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
               ?? req.socket?.remoteAddress
               ?? '127.0.0.1';
      const ua = req.headers['user-agent'] ?? 'unknown';
      visitor_key = crypto.createHash('sha256').update(`${ip}-${ua}`).digest('hex');
    }

    const todayStr = getIstDate().toFormat('yyyy-LL-dd');

    // Upsert – one document per (date, visitor_key) with page_views incremented
    await SiteVisitorDaily.findOneAndUpdate(
      { visit_date: todayStr, visitor_key },
      { $inc: { page_views: 1 }, $set: { last_seen: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, date: todayStr });
  } catch (err) {
    console.error('trackVisit error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/visitors/stats
 * Returns summary cards and chart data for the requested period/year.
 */
export const getVisitorStats = async (req, res) => {
  try {
    const validPeriods = ['today', 'week', 'month', 'last_month', 'six_months', 'year'];
    const period = validPeriods.includes(req.query.period) ? req.query.period : 'month';
    const currentYear = getIstDate().year;
    const selectedYear = Math.min(
      2100,
      Math.max(1900, Number(req.query.year) || currentYear)
    );

    const now = getIstDate();

    // ---------- Summary cards ----------
    const summary = {
      today: await SiteVisitorDaily.countDocuments({
        visit_date: now.toFormat('yyyy-LL-dd')
      }),
      week: await SiteVisitorDaily.countDocuments({
        visit_date: {
          $gte: now.startOf('week').toISODate(),
          $lte: now.toISODate()
        }
      }),
      month: await SiteVisitorDaily.countDocuments({
        visit_date: {
          $gte: now.startOf('month').toISODate(),
          $lte: now.toISODate()
        }
      }),
      last_month: await SiteVisitorDaily.countDocuments({
        visit_date: {
          $gte: now.minus({ months: 1 }).startOf('month').toISODate(),
          $lte: now.minus({ months: 1 }).endOf('month').toISODate()
        }
      }),
      six_months: await SiteVisitorDaily.countDocuments({
        visit_date: {
          $gte: now.minus({ months: 5 }).startOf('month').toISODate(),
          $lte: now.toISODate()
        }
      })
    };

    // ---------- Determine chart window ----------
    let periodStart, periodEnd = now;
    const monthlyChart = ['six_months', 'year'].includes(period);

    switch (period) {
      case 'today':
        periodStart = now;
        break;
      case 'week':
        periodStart = now.startOf('week');
        break;
      case 'last_month':
        periodStart = now.minus({ months: 1 }).startOf('month');
        periodEnd   = now.minus({ months: 1 }).endOf('month');
        break;
      case 'six_months':
        periodStart = now.minus({ months: 5 }).startOf('month');
        break;
      case 'year':
        periodStart = DateTime.fromObject({ year: selectedYear, month: 1, day: 1 }).setZone('Asia/Kolkata');
        periodEnd   = DateTime.fromObject({ year: selectedYear, month: 12, day: 31 }).setZone('Asia/Kolkata');
        break;
      case 'month':
      default:
        periodStart = now.startOf('month');
        break;
    }

    const startStr = periodStart.toFormat('yyyy-LL-dd');
    const endStr   = periodEnd.toFormat('yyyy-LL-dd');

    // ---------- Build chart data (aggregation) ----------
    let days = [];
    if (monthlyChart) {
      // Group by YYYY‑MM
      const agg = await SiteVisitorDaily.aggregate([
        { $match: { visit_date: { $gte: startStr, $lte: endStr } } },
        {
          $group: {
            _id: { $substr: ['$visit_date', 0, 7] }, // YYYY‑MM
            visitors: { $sum: 1 },
            page_views: { $sum: '$page_views' }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      const map = Object.fromEntries(agg.map(r => [r._id, r.visitors]));

      // month‑by‑month loop
      let cur = periodStart.startOf('month');
      const endMonth = periodEnd.startOf('month');
      while (cur <= endMonth) {
        const key = cur.toFormat('yyyy-LL');
        days.push({
          label: period === 'year' ? cur.toFormat('LLL') : `${cur.toFormat('LLL')} ${cur.year}`,
          key,
          visitors: map[key] ?? 0
        });
        cur = cur.plus({ months: 1 });
      }
    } else {
      // Daily grouping
      const agg = await SiteVisitorDaily.aggregate([
        { $match: { visit_date: { $gte: startStr, $lte: endStr } } },
        {
          $group: {
            _id: '$visit_date',
            visitors: { $sum: 1 },
            page_views: { $sum: '$page_views' }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      const map = Object.fromEntries(agg.map(r => [r._id, r.visitors]));

      let cur = periodStart;
      while (cur <= periodEnd) {
        const key = cur.toFormat('yyyy-LL-dd');
        let label = '';
        if (['month', 'last_month'].includes(period)) {
          label = cur.day;
        } else if (period === 'week') {
          label = `${cur.toFormat('ccc')} ${cur.day}`;
        } else {
          label = `${cur.toFormat('LLL')} ${cur.day}`;
        }
        days.push({ label, key, visitors: map[key] ?? 0 });
        cur = cur.plus({ days: 1 });
      }
    }

    // ---------- Year‑over‑Year comparison (12 months) ----------
    const yearStart = DateTime.fromObject({ year: selectedYear, month: 1, day: 1 }).setZone('Asia/Kolkata');
    const yearEnd   = DateTime.fromObject({ year: selectedYear, month: 12, day: 31 }).setZone('Asia/Kolkata');

    const yearAgg = await SiteVisitorDaily.aggregate([
      { $match: { visit_date: { $gte: yearStart.toISODate(), $lte: yearEnd.toISODate() } } },
      {
        $group: {
          _id: { $substr: ['$visit_date', 0, 7] }, // YYYY‑MM
          visitors: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const yearMap = Object.fromEntries(yearAgg.map(r => [r._id, r.visitors]));
    const yearDays = [];
    for (let m = 1; m <= 12; m++) {
      const key = `${selectedYear}-${String(m).padStart(2, '0')}`;
      yearDays.push({
        label: DateTime.fromObject({ month: m }).setZone('Asia/Kolkata').toFormat('LLL'),
        key,
        visitors: yearMap[key] ?? 0
      });
    }

    // ---------- Respond ----------
    return res.status(200).json({
      success: true,
      period,
      selectedYear,
      summaryCards: [
        { label: 'Visitors today',        count: summary.today },
        { label: 'Visitors this week',   count: summary.week },
        { label: 'Visitors this month',  count: summary.month },
        { label: 'Visitors last month',  count: summary.last_month },
        { label: 'Visitors last 6 months', count: summary.six_months }
      ],
      days,
      yearDays,
      totalToday: summary.today,
      totalThisMonth: summary.month
    });
  } catch (err) {
    console.error('getVisitorStats error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
