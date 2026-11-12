import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  Globe, 
  Filter, 
  ArrowUpRight,
  Eye,
  BarChart3,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { visitorService } from '../../services/visitorService';

// Period definitions matching the analytics schema
const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'last_month', label: 'Last Month' },
  { key: 'six_months', label: 'Last 6 Months' },
];

/**
 * Modern Responsive SVG Bar Chart Component
 */
const InteractiveBarChart = ({ data = [], height = 280, color = '#d97706', activeKey = '' }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const maxValue = useMemo(() => {
    if (!data.length) return 5;
    const max = Math.max(...data.map((d) => d.visitors || 0));
    return max > 0 ? Math.ceil(max * 1.15) : 5;
  }, [data]);

  // Generate 4 horizontal gridlines
  const yTicks = useMemo(() => {
    const ticks = [];
    const step = Math.ceil(maxValue / 4);
    for (let i = 0; i <= 4; i++) {
      ticks.push(i * step);
    }
    return ticks;
  }, [maxValue]);

  const chartMax = yTicks[yTicks.length - 1] || 5;

  if (!data.length) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 font-sans">
        <BarChart3 className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300" />
        <p className="text-sm">No visitor sessions recorded for this period yet.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full font-sans">
      {/* Tooltip on hover */}
      {hoveredItem && (
        <div 
          className="absolute -top-12 z-20 pointer-events-none transform -translate-x-1/2 bg-[#0c1425] text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-amber-400/30 whitespace-nowrap flex items-center gap-1.5 transition-all"
          style={{ left: `${hoveredItem.xPercent}%` }}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="font-semibold text-amber-200">{hoveredItem.label}:</span>
          <span className="font-bold">{hoveredItem.visitors} {hoveredItem.visitors === 1 ? 'visitor' : 'visitors'}</span>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <div 
          className="min-w-full" 
          style={{ 
            minWidth: data.length > 15 ? `${data.length * 28}px` : '100%',
            height: `${height}px` 
          }}
        >
          <div className="relative w-full h-full flex flex-col justify-between">
            
            {/* Gridlines Background */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
              {yTicks.slice().reverse().map((tick, i) => (
                <div key={i} className="flex items-center w-full">
                  <span className="text-[10px] font-semibold text-slate-400 w-8 text-right pr-2 shrink-0">
                    {tick}
                  </span>
                  <div className="flex-1 border-b border-slate-200/60"></div>
                </div>
              ))}
            </div>

            {/* Bars Container */}
            <div className="relative flex-1 flex items-end pl-9 pr-2 pb-7 pt-3 gap-1 sm:gap-2">
              {data.map((item, index) => {
                const heightPercent = chartMax > 0 ? (item.visitors / chartMax) * 100 : 0;
                const isHovered = hoveredItem?.index === index;
                const isZero = item.visitors === 0;

                return (
                  <div
                    key={item.key || index}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parentRect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
                      const xPercent = ((rect.left + rect.width / 2 - parentRect.left) / parentRect.width) * 100;
                      setHoveredItem({
                        ...item,
                        index,
                        xPercent: Math.max(8, Math.min(92, xPercent))
                      });
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* The Bar */}
                    <div 
                      className="w-full max-w-[34px] rounded-t-md transition-all duration-300 relative"
                      style={{
                        height: isZero ? '3px' : `${Math.max(4, heightPercent)}%`,
                        backgroundColor: isZero 
                          ? '#e2e8f0' 
                          : isHovered 
                            ? '#f59e0b' 
                            : color,
                        boxShadow: isHovered && !isZero ? '0 4px 12px rgba(217, 119, 6, 0.4)' : 'none'
                      }}
                    >
                      {/* Top highlight indicator */}
                      {!isZero && (
                        <div className="w-full h-1 bg-amber-200/40 rounded-t-md"></div>
                      )}
                    </div>

                    {/* X-axis Label */}
                    <span 
                      className={`absolute -bottom-6 text-[10px] sm:text-[11px] font-medium transition-colors whitespace-nowrap ${
                        isHovered ? 'text-amber-600 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminVisitors = () => {
  const currentYear = new Date().getFullYear();
  const [period, setPeriod] = useState('month');
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
    days: [],
    yearDays: []
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await visitorService.getStats(period, selectedYear);
      if (data && data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error('Fetch stats failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period, selectedYear]);

  // Total visitors in current chart
  const currentChartTotal = useMemo(() => {
    return stats.days.reduce((acc, curr) => acc + (curr.visitors || 0), 0);
  }, [stats.days]);

  // Total visitors in year chart
  const yearChartTotal = useMemo(() => {
    return stats.yearDays.reduce((acc, curr) => acc + (curr.visitors || 0), 0);
  }, [stats.yearDays]);

  const activePeriodLabel = PERIODS.find((p) => p.key === period)?.label || 'This Month';

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Website Visitors
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Analytics
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Anonymous website traffic tracking, daily visitor sessions & annual trends
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.summaryCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow ${
              idx === stats.summaryCards.length - 1 && stats.summaryCards.length % 2 !== 0 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                {idx === 0 ? (
                  <Users className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <CalendarDays className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                  {card.label}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                  {card.count.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Period Filter Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PERIODS.map((p) => {
          const isActive = period === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-brandOrange-500 text-white border-transparent shadow-md shadow-amber-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Main Period Bar Chart Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Visitor sessions · {activePeriodLabel}</span>
              <span className="text-xs font-normal text-slate-500">
                ({currentChartTotal} total {currentChartTotal === 1 ? 'session' : 'sessions'})
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily unique visitor breakdown for the selected timeframe
            </p>
          </div>
        </div>

        {/* Chart Canvas */}
        <InteractiveBarChart 
          data={stats.days} 
          height={300} 
          color="rgba(217, 119, 6, 0.85)" 
          activeKey={period}
        />
      </div>

      {/* Year Filter & Annual Breakdown Chart */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Visitor sessions · Year {selectedYear}</span>
              <span className="text-xs font-normal text-slate-500">
                ({yearChartTotal} total {yearChartTotal === 1 ? 'session' : 'sessions'})
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monthly visitor trends comparison across all 12 months
            </p>
          </div>

          {/* Year Picker Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="year-select" className="text-xs font-medium text-slate-500">
              Select Year:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 12-Month Year Chart Canvas */}
        <InteractiveBarChart 
          data={stats.yearDays} 
          height={280} 
          color="#d97706" 
          activeKey={String(selectedYear)}
        />
      </div>

    </div>
  );
};

export default AdminVisitors;

