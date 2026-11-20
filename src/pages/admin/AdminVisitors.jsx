import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  RefreshCw, 
  Globe, 
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { visitorService } from '../../services/visitorService';

// Backend API-based visitor service
const simpleVisitorService = {
  getStats: async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const currentYear = new Date().getFullYear();
      
      // Fetch from backend API
      const response = await fetch(`${apiUrl}/api/visitors/stats?period=year&year=${currentYear}`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.success) {
        return {
          success: true,
          summaryCards: data.summaryCards || [
            { label: 'Visitors today', count: 0 },
            { label: 'Visitors this week', count: 0 },
            { label: 'Visitors this month', count: 0 },
            { label: 'Visitors last month', count: 0 },
            { label: 'Visitors last 6 months', count: 0 },
          ],
          yearDays: data.yearDays || []
        };
      }
      
      throw new Error('Invalid response format');
    } catch (err) {
      console.error('Failed to load stats from backend:', err);
      
      // Fallback to localStorage if backend fails
      try {
        const records = JSON.parse(localStorage.getItem('visitor_records') || '[]');
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

        // Group by date and count unique IPs
        const uniqueIPsByDate = {};
        records.forEach(record => {
          const date = record.date;
          if (!uniqueIPsByDate[date]) {
            uniqueIPsByDate[date] = new Set();
          }
          uniqueIPsByDate[date].add(record.ip);
        });

        // Calculate counts
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

        // Generate year chart data (12 months)
        const currentYear = now.getFullYear();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const yearDays = [];

        for (let month = 0; month < 12; month++) {
          const visitors = Object.entries(uniqueIPsByDate)
            .filter(([date]) => {
              const d = new Date(date);
              return d.getFullYear() === currentYear && d.getMonth() === month;
            })
            .reduce((sum, [, ips]) => sum + ips.size, 0);
          
          yearDays.push({ label: monthNames[month], visitors });
        }

        return {
          success: true,
          summaryCards: [
            { label: 'Visitors today', count: visitorsToday },
            { label: 'Visitors this week', count: visitorsThisWeek },
            { label: 'Visitors this month', count: visitorsThisMonth },
            { label: 'Visitors last month', count: visitorsLastMonth },
            { label: 'Visitors last 6 months', count: visitorsLast6Months },
          ],
          yearDays
        };
      } catch (localErr) {
        console.error('LocalStorage fallback also failed:', localErr);
        return {
          success: false,
          summaryCards: [
            { label: 'Visitors today', count: 0 },
            { label: 'Visitors this week', count: 0 },
            { label: 'Visitors this month', count: 0 },
            { label: 'Visitors last month', count: 0 },
            { label: 'Visitors last 6 months', count: 0 },
          ],
          yearDays: []
        };
      }
    }
  }
};

/**
 * Simple Bar Chart Component with Y-Axis
 */
const BarChartComponent = ({ data = [] }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const maxValue = useMemo(() => {
    if (!data.length) return 5;
    const max = Math.max(...data.map((d) => d.visitors || 0));
    return max > 0 ? Math.ceil(max * 1.15) : 5;
  }, [data]);

  // Generate Y-axis ticks (5 levels)
  const yTicks = useMemo(() => {
    const ticks = [];
    const step = Math.ceil(maxValue / 4);
    for (let i = 0; i <= 4; i++) {
      ticks.push(i * step);
    }
    return ticks.reverse(); // Top to bottom
  }, [maxValue]);

  if (!data.length) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400">
        <BarChart3 className="w-10 h-10 mb-2 text-slate-300" />
        <p className="text-sm">No visitor sessions recorded for this period yet.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 pb-2 overflow-x-auto">
      {/* Tooltip */}
      {hoveredItem && (
        <div 
          className="absolute -top-12 z-20 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5"
          style={{ left: `${hoveredItem.xPercent}%`, transform: 'translateX(-50%)' }}
        >
          <span className="font-semibold">{hoveredItem.label}:</span>
          <span>{hoveredItem.visitors} {hoveredItem.visitors === 1 ? 'visitor' : 'visitors'}</span>
        </div>
      )}

      {/* Chart with Y-Axis */}
      <div className="h-full flex gap-3 min-w-[800px]">
        {/* Y-Axis */}
        <div className="flex flex-col justify-between pb-12 w-12 text-right">
          {yTicks.map((tick, idx) => (
            <div key={idx} className="text-xs font-medium text-slate-500 -mt-2">
              {tick}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative">
          {/* Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pb-12 pointer-events-none">
            {yTicks.map((_, idx) => (
              <div key={idx} className="border-b border-slate-200"></div>
            ))}
          </div>

          {/* Bars */}
          <div className="h-full flex items-end justify-between gap-2 px-4 pb-12 pt-2 relative min-w-[720px]">
            {data.map((item, index) => {
              const heightPercent = maxValue > 0 ? (item.visitors / maxValue) * 100 : 0;
              const isHovered = hoveredItem?.index === index;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-end h-full group cursor-pointer"
                  style={{ flex: '1 1 0', minWidth: '50px' }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                    const xPercent = ((rect.left + rect.width / 2 - parentRect.left) / parentRect.width) * 100;
                    setHoveredItem({ ...item, index, xPercent });
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Bar */}
                  <div 
                    className="w-full rounded-t-md transition-all duration-300"
                    style={{
                      height: `${Math.max(2, heightPercent)}%`,
                      backgroundColor: isHovered ? '#f59e0b' : '#d97706'
                    }}
                  />
                  {/* Label */}
                  <span className={`mt-2 text-[11px] font-medium whitespace-nowrap ${isHovered ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminVisitors = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    summaryCards: [
      { label: 'Visitors today', count: 0 },
      { label: 'Visitors this week', count: 0 },
      { label: 'Visitors this month', count: 0 },
      { label: 'Visitors last month', count: 0 },
      { label: 'Visitors last 6 months', count: 0 },
    ],
    yearDays: []
  });

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await simpleVisitorService.getStats();
      
      if (data && data.success) {
        setStats(data);
      } else {
        setError('No data available');
      }
    } catch (err) {
      console.error('Fetch stats failed:', err);
      setError(err.message || 'Failed to load visitor stats');
    } finally {
      setLoading(false);
    }
  };

  // No Firebase listener - just refresh every 30 seconds
  useEffect(() => {
    fetchStats();
    
    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [selectedYear]);

  // Total visitors in year
  const yearChartTotal = useMemo(() => {
    return stats.yearDays.reduce((acc, curr) => acc + (curr.visitors || 0), 0);
  }, [stats.yearDays]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Website Visitors
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Anonymous website traffic tracking, daily visitor sessions & annual trends
            </p>
          </div>
        </div>
      </div>

      {/* 5 Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {stats.summaryCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${
              idx === stats.summaryCards.length - 1 ? 'col-span-2 md:col-span-1' : ''
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                {idx === 0 ? (
                  <Users className="w-6 h-6 stroke-[2.2]" />
                ) : (
                  <CalendarDays className="w-6 h-6 stroke-[2.2]" />
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">
                  {card.label}
                </p>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
                  {card.count.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Year Chart with Year Picker */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Visitor sessions · Year {selectedYear}
              <span className="text-xs font-normal text-slate-500">
                ({yearChartTotal} total sessions)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monthly visitor trends comparison across all 12 months
            </p>
          </div>

          {/* Year Picker - Number Input with Up/Down Arrows */}
          <div className="flex items-center">
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              min="2020"
              max="2030"
              className="w-24 px-3 py-1.5 text-base font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Year Chart */}
        {error ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <div className="text-red-500 text-center">
              <p className="font-semibold">Error loading data</p>
              <p className="text-sm mt-2">{error}</p>
              <p className="text-xs mt-2 text-slate-500">Check browser console (F12) for details</p>
              <button
                onClick={fetchStats}
                className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <BarChartComponent data={stats.yearDays} />
        )}
      </div>

    </div>
  );
};

export default AdminVisitors;
