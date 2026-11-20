import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  RefreshCw, 
  Globe, 
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { visitorService } from '../../services/visitorService';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';

/**
 * Simple Bar Chart Component
 */
const BarChartComponent = ({ data = [] }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const maxValue = useMemo(() => {
    if (!data.length) return 5;
    const max = Math.max(...data.map((d) => d.visitors || 0));
    return max > 0 ? Math.ceil(max * 1.15) : 5;
  }, [data]);

  if (!data.length) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400">
        <BarChart3 className="w-10 h-10 mb-2 text-slate-300" />
        <p className="text-sm">No visitor sessions recorded for this period yet.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64">
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

      {/* Chart */}
      <div className="h-full flex items-end justify-between gap-2 px-4">
        {data.map((item, index) => {
          const heightPercent = maxValue > 0 ? (item.visitors / maxValue) * 100 : 0;
          const isHovered = hoveredItem?.index === index;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
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
              <span className={`mt-2 text-[10px] font-medium ${isHovered ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AdminVisitors = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
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
    try {
      const data = await visitorService.getStats('year', selectedYear);
      if (data && data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error('Fetch stats failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time listener for today's visitors
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const visitorsRef = collection(db, 'visitors');
    const todayQuery = query(
      visitorsRef,
      where('timestamp', '>=', Timestamp.fromDate(today))
    );

    const unsubscribe = onSnapshot(todayQuery, () => {
      fetchStats();
    });

    return () => unsubscribe();
  }, [selectedYear]);

  useEffect(() => {
    fetchStats();
  }, [selectedYear]);

  // Total visitors in year
  const yearChartTotal = useMemo(() => {
    return stats.yearDays.reduce((acc, curr) => acc + (curr.visitors || 0), 0);
  }, [stats.yearDays]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              Website Visitors
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Analytics
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Anonymous website traffic tracking, daily visitor sessions & annual trends
            </p>
          </div>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                {idx === 0 ? (
                  <Users className="w-5 h-5" />
                ) : (
                  <CalendarDays className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {card.label}
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
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

          {/* Year Display (No Dropdown) */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-lg font-bold text-slate-800">{selectedYear}</span>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Year Chart */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
          </div>
        ) : (
          <BarChartComponent data={stats.yearDays} />
        )}
      </div>

    </div>
  );
};

export default AdminVisitors;
