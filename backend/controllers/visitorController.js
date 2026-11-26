// backend/controllers/visitorController.js
import crypto from 'crypto';
import SiteVisitorDaily from '../models/SiteVisitorDaily.js';
import { DateTime } from 'luxon'; // npm i luxon for timezone handling

// Helper: get current date/time in IST (Asia/Kolkata)
const getIstDate = () => DateTime.now().setZone('Asia/Kolkata');

const countUniqueVisitors = async (startDate, endDate = startDate) => {
  const rows = await SiteVisitorDaily.aggregate([
    { $match: { visit_date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: { date: '$visit_date', visitor: '$visitor_key' } } },
    { $count: 'count' }
  ]);
  return rows[0]?.count || 0;
};

/**
 * POST /api/visitors/track
 * Record a page view for an anonymous visitor.
 * A browser session ID identifies a visitor for the day. Store only its hash.
 */
export const trackVisit = async (req, res) => {
  try {
    const suppliedSessionId = req.body?.visitor_key;
    let sessionId = typeof suppliedSessionId === 'string' && suppliedSessionId.length >= 8
      ? suppliedSessionId
      : null;

    // Fallback for clients that cannot provide a browser session ID.
    if (!sessionId) {
      const forwardedFor = req.headers['x-forwarded-for'];
      const ip = (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '')
        || req.ip
        || req.socket?.remoteAddress
        || 'unknown';
      sessionId = `ip:${ip}`;
    }

    // Store a hash, never the raw browser session ID or fallback IP.
    const visitor_key = crypto.createHash('sha256').update(sessionId).digest('hex');

    const todayStr = getIstDate().toFormat('yyyy-LL-dd');

    // Upsert – one document per (date, visitor_key) with page_views incremented
    try {
      await SiteVisitorDaily.findOneAndUpdate(
        { visit_date: todayStr, visitor_key },
        { $inc: { page_views: 1 }, $set: { last_seen: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (writeError) {
      // Concurrent requests from one visitor can race on the unique daily index.
      if (writeError?.code !== 11000) throw writeError;
      await SiteVisitorDaily.updateOne(
        { visit_date: todayStr, visitor_key },
        { $inc: { page_views: 1 }, $set: { last_seen: new Date() } }
      );
    }

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
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const validPeriods = ['today', 'week', 'month', 'last_month', 'six_months', 'year'];
    const period = validPeriods.includes(req.query.period) ? req.query.period : 'month';
    const currentYear = getIstDate().year;
    const selectedYear = Math.min(
      2100,
      Math.max(1900, Number(req.query.year) || currentYear)
    );

    const now = getIstDate();

    // ---------- Summary cards ----------
    const [today, yesterday, week, month, last_month, six_months] = await Promise.all([
      countUniqueVisitors(now.toFormat('yyyy-LL-dd')),
      countUniqueVisitors(now.minus({ days: 1 }).toFormat('yyyy-LL-dd')),
      countUniqueVisitors(now.startOf('week').toFormat('yyyy-LL-dd'), now.toFormat('yyyy-LL-dd')),
      countUniqueVisitors(now.startOf('month').toFormat('yyyy-LL-dd'), now.toFormat('yyyy-LL-dd')),
      countUniqueVisitors(
        now.minus({ months: 1 }).startOf('month').toFormat('yyyy-LL-dd'),
        now.minus({ months: 1 }).endOf('month').toFormat('yyyy-LL-dd')
      ),
      countUniqueVisitors(now.minus({ months: 5 }).startOf('month').toFormat('yyyy-LL-dd'), now.toFormat('yyyy-LL-dd'))
    ]);
    const summary = { today, yesterday, week, month, last_month, six_months };

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
            _id: { date: '$visit_date', visitor: '$visitor_key' }
          }
        },
        {
          $group: {
            _id: { $substr: ['$_id.date', 0, 7] },
            visitors: { $sum: 1 }
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
            _id: { date: '$visit_date', visitor: '$visitor_key' }
          }
        },
        {
          $group: {
            _id: '$_id.date',
            visitors: { $sum: 1 }
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
          _id: { date: '$visit_date', visitor: '$visitor_key' }
        }
      },
      {
        $group: {
          _id: { $substr: ['$_id.date', 0, 7] },
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
        { label: 'Visitors yesterday',    count: summary.yesterday },
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
