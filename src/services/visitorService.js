import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

export const visitorService = {
  /**
   * Track an anonymous visitor view - Real-time Firebase
   * Safe, non-blocking and throttled
   */
  trackVisitor: async (pathname = window.location.pathname) => {
    try {
      if (pathname.toLowerCase().startsWith('/admin')) {
        return;
      }

      // 15 seconds session throttle to prevent redundant calls on fast re-renders
      const now = Date.now();
      const lastTrack = parseInt(sessionStorage.getItem('dr_bharathi_last_track') || '0', 10);
      if (now - lastTrack < 15000) {
        return;
      }
      sessionStorage.setItem('dr_bharathi_last_track', String(now));

      let visitorKey = localStorage.getItem('dr_bharathi_vid');
      if (!visitorKey) {
        visitorKey = 'vid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
        localStorage.setItem('dr_bharathi_vid', visitorKey);
      }

      // Get visitor IP address
      let ipAddress = 'unknown';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (err) {
        console.warn('Could not fetch IP:', err);
      }

      // Store visitor session in Firebase Firestore with IP
      const visitorsRef = collection(db, 'visitors');
      const docRef = await addDoc(visitorsRef, {
        visitorKey,
        ipAddress, // Real IP address
        path: pathname,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD for easy filtering
        createdAt: Timestamp.now()
      });
      console.log('[VisitorService] Tracked successfully:', docRef.id);
    } catch (err) {
      // Fail silently without disrupting user browsing experience
      console.error('[VisitorService] Track failed:', err.message, err.code);
    }
  },

  /**
   * Fetch visitor statistics for Admin - Real-time Firebase
   */
  getStats: async (period = 'month', year = new Date().getFullYear()) => {
    try {
      console.log('[VisitorService] Fetching stats:', { period, year });
      const visitorsRef = collection(db, 'visitors');
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDate = now.getDate();

      // Calculate date ranges
      const today = new Date(currentYear, currentMonth, currentDate);
      const weekAgo = new Date(currentYear, currentMonth, currentDate - 7);
      const monthStart = new Date(currentYear, currentMonth, 1);
      const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
      const lastMonthEnd = new Date(currentYear, currentMonth, 0);
      const sixMonthsAgo = new Date(currentYear, currentMonth - 6, 1);

      // Query all visitors for the year
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31, 23, 59, 59);
      
      const q = query(
        visitorsRef,
        where('timestamp', '>=', Timestamp.fromDate(yearStart)),
        where('timestamp', '<=', Timestamp.fromDate(yearEnd)),
        orderBy('timestamp', 'asc')
      );

      const snapshot = await getDocs(q);
      const allVisits = [];
      const uniqueVisitorsByDate = {};
      const uniqueIPsByDate = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.date || data.timestamp.toDate().toISOString().split('T')[0];
        allVisits.push({ ...data, date });

        // Track unique visitor keys per day
        if (!uniqueVisitorsByDate[date]) {
          uniqueVisitorsByDate[date] = new Set();
        }
        uniqueVisitorsByDate[date].add(data.visitorKey);

        // Track unique IPs per day (for accurate visitor count)
        if (!uniqueIPsByDate[date]) {
          uniqueIPsByDate[date] = new Set();
        }
        if (data.ipAddress && data.ipAddress !== 'unknown') {
          uniqueIPsByDate[date].add(data.ipAddress);
        }
      });

      // Calculate summary cards using unique IPs
      const todayStr = today.toISOString().split('T')[0];
      const visitorsToday = uniqueIPsByDate[todayStr]?.size || 0;

      const visitorsThisWeek = Object.entries(uniqueIPsByDate)
        .filter(([date]) => new Date(date) >= weekAgo)
        .reduce((sum, [, ips]) => sum + ips.size, 0);

      const visitorsThisMonth = Object.entries(uniqueIPsByDate)
        .filter(([date]) => new Date(date) >= monthStart)
        .reduce((sum, [, ips]) => sum + ips.size, 0);

      const visitorsLastMonth = Object.entries(uniqueIPsByDate)
        .filter(([date]) => {
          const d = new Date(date);
          return d >= lastMonthStart && d <= lastMonthEnd;
        })
        .reduce((sum, [, ips]) => sum + ips.size, 0);

      const visitorsLast6Months = Object.entries(uniqueIPsByDate)
        .filter(([date]) => new Date(date) >= sixMonthsAgo)
        .reduce((sum, [, ips]) => sum + ips.size, 0);

      // Generate period chart data (using unique IPs)
      const days = generatePeriodData(period, year, uniqueIPsByDate);
      
      // Generate year chart data (12 months using unique IPs)
      const yearDays = generateYearData(year, uniqueIPsByDate);

      return {
        success: true,
        period,
        selectedYear: year,
        summaryCards: [
          { label: 'Visitors today', count: visitorsToday },
          { label: 'Visitors this week', count: visitorsThisWeek },
          { label: 'Visitors this month', count: visitorsThisMonth },
          { label: 'Visitors last month', count: visitorsLastMonth },
          { label: 'Visitors last 6 months', count: visitorsLast6Months },
        ],
        days,
        yearDays
      };
    } catch (err) {
      console.error('[VisitorService] Failed to load visitor stats:', err.message, err.code);
      console.error('Full error:', err);
      return {
        success: false,
        period,
        selectedYear: year,
        summaryCards: [
          { label: 'Visitors today', count: 0 },
          { label: 'Visitors this week', count: 0 },
          { label: 'Visitors this month', count: 0 },
          { label: 'Visitors last month', count: 0 },
          { label: 'Visitors last 6 months', count: 0 },
        ],
        days: [],
        yearDays: []
      };
    }
  }
};

// Helper: Generate chart data for selected period
function generatePeriodData(period, year, uniqueIPsByDate) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  let days = [];

  if (period === 'today') {
    // Last 24 hours by hour
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000).getHours();
      days.push({ label: `${hour}:00`, visitors: 0 });
    }
  } else if (period === 'week') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth, now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const visitors = uniqueIPsByDate[dateStr]?.size || 0;
      days.push({ 
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), 
        visitors 
      });
    }
  } else if (period === 'month') {
    // Current month days
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const visitors = uniqueIPsByDate[dateStr]?.size || 0;
      days.push({ label: `${day}`, visitors });
    }
  } else if (period === 'year') {
    // 12 months of selected year
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let month = 0; month < 12; month++) {
      const visitors = Object.entries(uniqueIPsByDate)
        .filter(([date]) => {
          const d = new Date(date);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, [, ips]) => sum + ips.size, 0);
      
      days.push({ label: monthNames[month], visitors });
    }
  }

  return days;
}

// Helper: Generate year overview (12 months)
function generateYearData(year, uniqueIPsByDate) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yearDays = [];

  for (let month = 0; month < 12; month++) {
    const visitors = Object.entries(uniqueIPsByDate)
      .filter(([date]) => {
        const d = new Date(date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, [, ips]) => sum + ips.size, 0);
    
    yearDays.push({ label: monthNames[month], visitors });
  }

  return yearDays;
}

export default visitorService;

