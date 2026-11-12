import crypto from 'crypto';
import SiteVisitorDaily from '../models/SiteVisitorDaily.js';

// Helper to get current Date in IST (UTC+5:30)
const getIstDate = (dateObj = new Date()) => {
  const utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
  return new Date(utc + (330 * 60000));
};

const formatDateYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatDateYM = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @desc    Track an anonymous visitor page view
 * @route   POST /api/visitors/track
 * @access  Public
 */
export const trackVisit = async (req, res) => {
  try {
    let visitorKey = req.body?.visitor_key;

    if (!visitorKey || typeof visitorKey !== 'string' || visitorKey.length < 8) {
      // Fallback: anonymous hash of IP and User-Agent
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'unknown';
      visitorKey = crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex');
    }

    const nowIst = getIstDate();
    const todayStr = formatDateYMD(nowIst);

    // Upsert daily visitor record
    await SiteVisitorDaily.findOneAndUpdate(
      { visit_date: todayStr, visitor_key: visitorKey },
      {
        $inc: { page_views: 1 },
        $set: { last_seen: new Date() }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, date: todayStr });
  } catch (error) {
    // Tracking errors should never break client page loads
    console.error('Visitor track error:', error.message);
    return res.status(200).json({ success: false });
  }
};

/**
 * @desc    Get visitor statistics and chart breakdown by period & year
 * @route   GET /api/visitors/stats
 * @access  Private/Admin
 */
export const getVisitorStats = async (req, res) => {
  try {
    const validPeriods = ['today', 'week', 'month', 'last_month', 'six_months', 'year'];
    let period = req.query.period || 'month';
    if (!validPeriods.includes(period)) {
      period = 'month';
    }

    const currentYear = getIstDate().getFullYear();
    let selectedYear = parseInt(req.query.year, 10);
    if (isNaN(selectedYear) || selectedYear < 1900 || selectedYear > 2100) {
      selectedYear = currentYear;
    }

    const todayIst = getIstDate();
    const todayStr = formatDateYMD(todayIst);

    // Calculate ranges for Summary Cards
    // 1. Visitors today
    const countToday = await SiteVisitorDaily.countDocuments({
      visit_date: todayStr
    });

    // 2. Visitors this week (Monday to today)
    const dayOfWeek = todayIst.getDay(); // 0 is Sunday, 1 is Monday...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayIst = new Date(todayIst);
    mondayIst.setDate(todayIst.getDate() + diffToMonday);
    const mondayStr = formatDateYMD(mondayIst);

    const countWeek = await SiteVisitorDaily.countDocuments({
      visit_date: { $gte: mondayStr, $lte: todayStr }
    });

    // 3. Visitors this month
    const thisMonthStartIst = new Date(todayIst.getFullYear(), todayIst.getMonth(), 1);
    const thisMonthStartStr = formatDateYMD(thisMonthStartIst);

    const countMonth = await SiteVisitorDaily.countDocuments({
      visit_date: { $gte: thisMonthStartStr, $lte: todayStr }
    });

    // 4. Visitors last month
    const lastMonthStartIst = new Date(todayIst.getFullYear(), todayIst.getMonth() - 1, 1);
    const lastMonthEndIst = new Date(todayIst.getFullYear(), todayIst.getMonth(), 0);
    const lastMonthStartStr = formatDateYMD(lastMonthStartIst);
    const lastMonthEndStr = formatDateYMD(lastMonthEndIst);

    const countLastMonth = await SiteVisitorDaily.countDocuments({
      visit_date: { $gte: lastMonthStartStr, $lte: lastMonthEndStr }
    });

    // 5. Visitors last 6 months
    const sixMonthsStartIst = new Date(todayIst.getFullYear(), todayIst.getMonth() - 5, 1);
    const sixMonthsStartStr = formatDateYMD(sixMonthsStartIst);

    const countSixMonths = await SiteVisitorDaily.countDocuments({
      visit_date: { $gte: sixMonthsStartStr, $lte: todayStr }
    });

    const summaryCards = [
      { label: 'Visitors today', count: countToday },
      { label: 'Visitors this week', count: countWeek },
      { label: 'Visitors this month', count: countMonth },
      { label: 'Visitors last month', count: countLastMonth },
      { label: 'Visitors last 6 months', count: countSixMonths },
    ];

    // Build Chart Data based on selected period
    let periodStart;
    let periodEnd = todayIst;
    const monthlyChart = ['six_months', 'year'].includes(period);

    switch (period) {
      case 'today':
        periodStart = todayIst;
        break;
      case 'week':
        periodStart = mondayIst;
        break;
      case 'last_month':
        periodStart = lastMonthStartIst;
        periodEnd = lastMonthEndIst;
        break;
      case 'six_months':
        periodStart = sixMonthsStartIst;
        break;
      case 'year':
        periodStart = new Date(selectedYear, 0, 1);
        periodEnd = new Date(selectedYear, 11, 31);
        break;
      case 'month':
      default:
        periodStart = thisMonthStartIst;
        break;
    }

    const periodStartStr = formatDateYMD(periodStart);
    const periodEndStr = formatDateYMD(periodEnd);

    const days = [];

    if (monthlyChart) {
      // Group by YYYY-MM
      const monthlyData = await SiteVisitorDaily.aggregate([
        {
          $match: {
            visit_date: { $gte: periodStartStr, $lte: periodEndStr }
          }
        },
        {
          $group: {
            _id: { $substr: ['$visit_date', 0, 7] },
            visitors: { $sum: 1 },
            page_views: { $sum: '$page_views' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const monthlyCounts = {};
      monthlyData.forEach(row => {
        monthlyCounts[row._id] = row.visitors;
      });

      // Loop month by month
      const curr = new Date(periodStart.getFullYear(), periodStart.getMonth(), 1);
      const endLimit = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1);

      while (curr <= endLimit) {
        const ymKey = formatDateYM(curr);
        const mLabel = period === 'year'
          ? monthNames[curr.getMonth()]
          : `${monthNames[curr.getMonth()]} ${curr.getFullYear()}`;

        days.push({
          label: mLabel,
          key: ymKey,
          visitors: monthlyCounts[ymKey] || 0
        });

        curr.setMonth(curr.getMonth() + 1);
      }
    } else {
      // Daily breakdown
      const dailyData = await SiteVisitorDaily.aggregate([
        {
          $match: {
            visit_date: { $gte: periodStartStr, $lte: periodEndStr }
          }
        },
        {
          $group: {
            _id: '$visit_date',
            visitors: { $sum: 1 },
            page_views: { $sum: '$page_views' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const dailyCounts = {};
      dailyData.forEach(row => {
        dailyCounts[row._id] = row.visitors;
      });

      const curr = new Date(periodStart);
      const endLimit = new Date(periodEnd);

      while (curr <= endLimit) {
        const ymdKey = formatDateYMD(curr);
        let label = '';
        if (['month', 'last_month'].includes(period)) {
          label = String(curr.getDate()); // Day of month 1, 2, ... 31
        } else if (period === 'week') {
          const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          label = `${weekdayNames[curr.getDay()]} ${curr.getDate()}`;
        } else {
          label = `${monthNames[curr.getMonth()]} ${curr.getDate()}`;
        }

        days.push({
          label,
          key: ymdKey,
          visitors: dailyCounts[ymdKey] || 0
        });

        curr.setDate(curr.getDate() + 1);
      }
    }

    // Year comparison data (12 months for selectedYear)
    const yearStartStr = `${selectedYear}-01-01`;
    const yearEndStr = `${selectedYear}-12-31`;

    const yearData = await SiteVisitorDaily.aggregate([
      {
        $match: {
          visit_date: { $gte: yearStartStr, $lte: yearEndStr }
        }
      },
      {
        $group: {
          _id: { $substr: ['$visit_date', 0, 7] },
          visitors: { $sum: 1 },
          page_views: { $sum: '$page_views' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const yearCounts = {};
    yearData.forEach(row => {
      yearCounts[row._id] = row.visitors;
    });

    const yearDays = [];
    for (let m = 0; m < 12; m++) {
      const ymKey = `${selectedYear}-${String(m + 1).padStart(2, '0')}`;
      yearDays.push({
        label: monthNames[m],
        key: ymKey,
        visitors: yearCounts[ymKey] || 0
      });
    }

    return res.status(200).json({
      success: true,
      period,
      selectedYear,
      summaryCards,
      days,
      yearDays,
      totalToday: countToday,
      totalThisMonth: countMonth
    });
  } catch (error) {
    console.error('getVisitorStats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve visitor statistics',
      error: error.message
    });
  }
};

