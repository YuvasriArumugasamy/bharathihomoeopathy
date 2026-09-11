import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  Star,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Boxes,
  Plus,
  Activity,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  Filter,
  Package,
  Layers,
  Phone,
  Palette
} from 'lucide-react';
import { adminDashboardData } from '../../data/adminDashboardData';
import { initialAdminOrders } from '../../data/adminOrdersData';

export const AdminDashboard = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };
  const [timeFilter, setTimeFilter] = useState('7 Days');
  const [metricView, setMetricView] = useState('revenue'); // 'revenue' | 'orders'
  const [chartTheme, setChartTheme] = useState('teal'); // 'teal' | 'indigo' | 'purple' | 'amber'
  const chartPoints = adminDashboardData.salesData[timeFilter] || adminDashboardData.salesData['7 Days'];

  // Real Orders pipeline calculation
  const orders = initialAdminOrders || [];
  const totalOrdersCount = orders.length;

  const pipelineStatuses = [
    { 
      label: 'Pending Confirmation', 
      count: orders.filter(o => o.orderStatus === 'Pending').length, 
      color: 'from-amber-400 to-orange-500', 
      barBg: 'bg-amber-500', 
      dot: 'bg-amber-500' 
    },
    { 
      label: 'Confirmed / Paid', 
      count: orders.filter(o => o.orderStatus === 'Confirmed' || (o.paymentStatus === 'Paid' && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled')).length, 
      color: 'from-sky-400 to-blue-500', 
      barBg: 'bg-sky-500', 
      dot: 'bg-sky-500' 
    },
    { 
      label: 'Dispensary Packing', 
      count: orders.filter(o => o.orderStatus === 'Processing').length, 
      color: 'from-purple-400 to-violet-500', 
      barBg: 'bg-purple-500', 
      dot: 'bg-purple-500' 
    },
    { 
      label: 'Out with Courier', 
      count: orders.filter(o => o.orderStatus === 'Shipped').length, 
      color: 'from-indigo-400 to-blue-600', 
      barBg: 'bg-indigo-500', 
      dot: 'bg-indigo-500' 
    },
    { 
      label: 'Delivered to Patient', 
      count: orders.filter(o => o.orderStatus === 'Delivered').length, 
      color: 'from-emerald-400 to-teal-500', 
      barBg: 'bg-emerald-500', 
      dot: 'bg-emerald-500' 
    },
    { 
      label: 'Cancelled / Refunded', 
      count: orders.filter(o => o.orderStatus === 'Cancelled').length, 
      color: 'from-rose-400 to-red-500', 
      barBg: 'bg-rose-500', 
      dot: 'bg-rose-500' 
    }
  ];

  const activeOrdersCount = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  const chartThemes = {
    teal: {
      name: 'Ocean Teal',
      bar: 'from-[#0f766e] via-[#0d9488] to-[#2dd4bf]',
      peak: 'from-[#047857] via-[#0d9488] to-[#34d399]',
      glow: 'shadow-teal-500/25',
      dot: 'bg-teal-400',
      legend: 'from-[#0f766e] to-[#2dd4bf]',
      pill: 'bg-teal-50 text-teal-800 border-teal-200',
      swatch: 'bg-teal-500'
    },
    indigo: {
      name: 'Royal Blue',
      bar: 'from-[#3730a3] via-[#4f46e5] to-[#38bdf8]',
      peak: 'from-[#312e81] via-[#4338ca] to-[#818cf8]',
      glow: 'shadow-indigo-500/25',
      dot: 'bg-sky-400',
      legend: 'from-[#3730a3] to-[#38bdf8]',
      pill: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      swatch: 'bg-indigo-600'
    },
    purple: {
      name: 'Amethyst',
      bar: 'from-[#6b21a8] via-[#9333ea] to-[#c084fc]',
      peak: 'from-[#581c87] via-[#7e22ce] to-[#d8b4fe]',
      glow: 'shadow-purple-500/25',
      dot: 'bg-purple-400',
      legend: 'from-[#6b21a8] to-[#c084fc]',
      pill: 'bg-purple-50 text-purple-800 border-purple-200',
      swatch: 'bg-purple-600'
    },
    amber: {
      name: 'Warm Sunset',
      bar: 'from-[#ea580c] via-[#f97316] to-[#fbbf24]',
      peak: 'from-[#c2410c] via-[#ea580c] to-[#fde047]',
      glow: 'shadow-orange-500/25',
      dot: 'bg-amber-400',
      legend: 'from-[#ea580c] to-[#fbbf24]',
      pill: 'bg-amber-50 text-amber-800 border-amber-200',
      swatch: 'bg-amber-500'
    }
  };

  const activeChartTheme = chartThemes[chartTheme] || chartThemes['teal'];

  const iconMap = {
    IndianRupee,
    ShoppingBag,
    Users,
    Calendar,
    Clock,
    AlertTriangle,
    MessageSquare,
    Star
  };

  // Bespoke aesthetic themes for each of the 8 KPI cards
  const kpiCardStyles = {
    'rev': {
      gradient: 'from-amber-500/15 via-orange-500/5 to-transparent',
      border: 'border-amber-200/90 hover:border-amber-400',
      iconGradient: 'from-amber-500 to-brandOrange-600',
      iconShadow: 'shadow-amber-500/25',
      accentColor: 'text-amber-600',
      topLine: 'bg-gradient-to-r from-amber-400 to-brandOrange-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'orders': {
      gradient: 'from-sky-500/15 via-blue-500/5 to-transparent',
      border: 'border-sky-200/90 hover:border-sky-400',
      iconGradient: 'from-sky-500 to-blue-600',
      iconShadow: 'shadow-sky-500/25',
      accentColor: 'text-sky-600',
      topLine: 'bg-gradient-to-r from-sky-400 to-blue-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'cust': {
      gradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
      border: 'border-emerald-200/90 hover:border-emerald-400',
      iconGradient: 'from-emerald-500 to-teal-600',
      iconShadow: 'shadow-emerald-500/25',
      accentColor: 'text-emerald-600',
      topLine: 'bg-gradient-to-r from-emerald-400 to-teal-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'apt': {
      gradient: 'from-purple-500/15 via-violet-500/5 to-transparent',
      border: 'border-purple-200/90 hover:border-purple-400',
      iconGradient: 'from-purple-500 to-violet-600',
      iconShadow: 'shadow-purple-500/25',
      accentColor: 'text-purple-600',
      topLine: 'bg-gradient-to-r from-purple-400 to-violet-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'pending_ord': {
      gradient: 'from-orange-500/15 via-amber-500/5 to-transparent',
      border: 'border-orange-200/90 hover:border-orange-400',
      iconGradient: 'from-orange-500 to-amber-600',
      iconShadow: 'shadow-orange-500/25',
      accentColor: 'text-orange-600',
      topLine: 'bg-gradient-to-r from-orange-400 to-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    'low_stock': {
      gradient: 'from-rose-500/15 via-red-500/5 to-transparent',
      border: 'border-rose-200/90 hover:border-rose-400',
      iconGradient: 'from-rose-500 to-red-600',
      iconShadow: 'shadow-rose-500/25',
      accentColor: 'text-rose-600',
      topLine: 'bg-gradient-to-r from-rose-400 to-red-500',
      badge: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    'enq': {
      gradient: 'from-cyan-500/15 via-teal-500/5 to-transparent',
      border: 'border-cyan-200/90 hover:border-cyan-400',
      iconGradient: 'from-cyan-500 to-blue-600',
      iconShadow: 'shadow-cyan-500/25',
      accentColor: 'text-cyan-600',
      topLine: 'bg-gradient-to-r from-cyan-400 to-blue-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    'rev_rate': {
      gradient: 'from-amber-400/15 via-yellow-400/5 to-transparent',
      border: 'border-amber-200/90 hover:border-amber-400',
      iconGradient: 'from-yellow-400 to-amber-500',
      iconShadow: 'shadow-yellow-500/25',
      accentColor: 'text-amber-500',
      topLine: 'bg-gradient-to-r from-yellow-400 to-amber-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      
      {/* 1. Hero Command Center Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
          
          {/* Left Greeting */}
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide font-serif italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            {getGreeting()}, Dr. Bharathi
          </h1>

          {/* Right: Quick Action Controls */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-white hover:bg-orange-50 text-orange-600 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-white cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Remedy</span>
            </Link>

            <Link
              to="/admin/appointments"
              className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-white hover:bg-orange-50 text-slate-900 hover:text-orange-600 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-white cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-orange-600 stroke-[2.5]" />
              <span>Appointments</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Elevated 8 KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {adminDashboardData.kpiStats.map((kpi) => {
          const IconComponent = iconMap[kpi.icon] || ShoppingBag;
          const style = kpiCardStyles[kpi.id] || kpiCardStyles['rev'];

          return (
            <div 
              key={kpi.id} 
              className={`relative bg-white/95 backdrop-blur-sm rounded-2xl p-5 border ${style.border} shadow-[0_4px_20px_-4px_rgba(15,36,56,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group`}
            >
              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${style.topLine}`} />
              
              {/* Ambient Background Gradient Corner */}
              <div className={`absolute -right-8 -top-8 w-28 h-28 bg-gradient-to-br ${style.gradient} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

              {/* Header: Title + Icon */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 font-display">
                  {kpi.title}
                </span>

                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${style.iconGradient} text-white flex items-center justify-center shadow-md ${style.iconShadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>
              </div>

              {/* Value & Trend */}
              <div className="relative z-10 flex items-baseline justify-between pt-3 pb-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                  {kpi.value}
                </span>

                <span className={`inline-flex items-center gap-0.5 text-[10.5px] font-black px-2 py-0.5 rounded-full border shadow-2xs ${style.badge}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-3 h-3 stroke-[2.5]" /> : <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />}
                  {kpi.change}
                </span>
              </div>

              {/* Subtext Footer */}
              <div className="relative z-10 flex items-center gap-1.5 pt-2 border-t border-slate-100/90 text-[11px] text-slate-400 font-semibold">
                <span className={`w-1.5 h-1.5 rounded-full ${kpi.isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span>{kpi.subtext}</span>
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. Analytics Section: Revenue & Order Trends Visualizer + Order Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-white/95 backdrop-blur-sm p-4.5 sm:p-7 lg:p-8 rounded-3xl sm:rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-5 sm:space-y-6 flex flex-col justify-between">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1 w-full sm:w-auto">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-brandOrange-500 to-amber-500 text-white shadow-md shadow-brandOrange-500/20 shrink-0">
                  <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight font-display">
                  Revenue & Order Analytics
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                Consolidated dispensary sales & online doctor consultation revenue
              </p>
            </div>

            {/* View, Time & Palette Filters */}
            <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3 w-full lg:w-auto mt-4 sm:mt-0">
              
              {/* Metric View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold border border-slate-200/70 shrink-0">
                <button
                  onClick={() => setMetricView('revenue')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                    metricView === 'revenue' 
                      ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Revenue (₹)
                </button>
                <button
                  onClick={() => setMetricView('orders')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                    metricView === 'orders' 
                      ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Orders
                </button>
              </div>

              {/* Palette Switcher */}
              <div className="flex items-center bg-slate-100 p-1.5 rounded-xl gap-1.5 border border-slate-200/70 shrink-0" title="Choose Chart Color Palette">
                <Palette className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
                {Object.keys(chartThemes).map((key) => (
                  <button
                    key={key}
                    onClick={() => setChartTheme(key)}
                    className={`w-4 h-4 rounded-full ${chartThemes[key].swatch} transition-all cursor-pointer ${
                      chartTheme === key ? 'ring-2 ring-offset-1 ring-slate-800 scale-125 shadow-xs' : 'opacity-60 hover:opacity-100 hover:scale-110'
                    }`}
                    title={chartThemes[key].name}
                  />
                ))}
              </div>

              {/* Time Range Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold border border-slate-200/70 shrink-0">
                {['7 Days', '30 Days', '90 Days'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                      timeFilter === t 
                        ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Visual Chart Container */}
          <div className="relative h-60 sm:h-64 flex items-end gap-2 sm:gap-4 lg:gap-6 pt-10 pb-3 border-b border-slate-100">
            {/* Background reference lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25">
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
              <div className="border-b border-dashed border-slate-300 w-full" />
            </div>

            {chartPoints.map((pt, i) => {
              const currentVal = metricView === 'revenue' ? pt.revenue : pt.orders;
              const maxVal = Math.max(...chartPoints.map(p => metricView === 'revenue' ? p.revenue : p.orders));
              const heightPercent = Math.max(12, Math.round((currentVal / maxVal) * 100));
              const isPeak = currentVal === maxVal;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 h-full justify-end group relative z-10">
                  {/* Interactive Floating Tooltip */}
                  <div className="absolute -top-10 bg-slate-900 text-white text-[10px] sm:text-[11px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl z-30 whitespace-nowrap flex items-center gap-1.5 border border-slate-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeChartTheme.dot}`} />
                    <span className="font-bold">{pt.label}:</span>
                    <span className="font-black text-amber-300">
                      {metricView === 'revenue' ? `₹${pt.revenue.toLocaleString()}` : `${pt.orders} orders`}
                    </span>
                  </div>

                  {/* Slot Background & Pillar */}
                  <div className="w-full h-full flex items-end justify-center bg-slate-100/50 hover:bg-slate-100/80 rounded-t-lg sm:rounded-t-xl transition-colors p-0.5 sm:p-1">
                    {/* Gradient Pillar Bar */}
                    <div
                      className={`w-full bg-gradient-to-t ${isPeak ? activeChartTheme.peak : activeChartTheme.bar} rounded-t-md sm:rounded-t-lg transition-all duration-500 group-hover:brightness-110 group-hover:scale-x-105 shadow-sm ${isPeak ? activeChartTheme.glow : ''} relative overflow-hidden`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className={`text-[10px] sm:text-[11px] font-bold mt-1 truncate ${isPeak ? 'text-slate-900 font-black' : 'text-slate-500'}`}>
                    {pt.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Footer Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2.5 pt-1">
            <div className="flex items-center gap-2 font-semibold text-[11px] sm:text-xs">
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r ${activeChartTheme.legend} rounded-full shrink-0 shadow-2xs`} />
              <span className="text-slate-700 font-bold truncate">Dispensary & Booking Volume ({activeChartTheme.name})</span>
            </div>

            <div className="flex items-center">
              <div className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold ${activeChartTheme.pill}`}>
                {chartPoints.length > 0 ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Peak: {chartPoints.reduce((max, pt) => (metricView === 'revenue' ? pt.revenue : pt.orders) > (metricView === 'revenue' ? max.revenue : max.orders) ? pt : max, chartPoints[0])?.label || 'N/A'}</span>
                  </>
                ) : (
                  <span>No activity recorded yet</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right: Order Status Pipeline */}
        <div className="lg:col-span-4 bg-white/95 backdrop-blur-sm p-5 sm:p-7 lg:p-8 rounded-3xl sm:rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
                Fulfillment Pipeline
              </h3>
              <span className="text-[10.5px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 shadow-2xs">
                {activeOrdersCount} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Live order status distribution across dispensary</p>
          </div>

          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {pipelineStatuses.map((st, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${st.dot} shrink-0`} />
                    <span className="text-slate-700 font-bold">{st.label}</span>
                  </span>
                  <span className="font-black text-slate-900 px-2 py-0.5 rounded-md bg-slate-100 text-[11.5px] shrink-0 border border-slate-200/50">{st.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className={`bg-gradient-to-r ${st.color} h-full rounded-full transition-all duration-700 shadow-2xs`} 
                    style={{ width: `${totalOrdersCount > 0 ? Math.max(4, Math.round((st.count / totalOrdersCount) * 100)) : 0}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/orders"
            className="w-full py-3.5 bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-extrabold text-xs rounded-2xl text-center shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 group cursor-pointer border border-white/20 active:scale-[0.99]"
          >
            <span>{totalOrdersCount > 0 ? `Manage All ${totalOrdersCount} Orders` : 'Manage Orders'}</span>
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* 4. Today's Consultations & Inventory Alert Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Consultations */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/70">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Today's Appointments</h3>
                <p className="text-xs text-slate-400 font-medium">Scheduled patient consultations</p>
              </div>
            </div>

            <Link to="/admin/appointments" className="text-xs font-black text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1 hover:underline">
              <span>View Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {adminDashboardData.todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                No appointments scheduled for today
              </div>
            ) : (
              adminDashboardData.todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-navy-950 to-purple-800 text-white font-black text-xs flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-amber-300 mb-0.5" />
                      <span className="text-[10px] leading-none">{apt.time.split(' ')[0]}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm group-hover:text-brandOrange-600 transition-colors">
                        {apt.patient}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        {apt.type} • {apt.doctor}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    apt.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/70">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Inventory Alerts</h3>
                <p className="text-xs text-slate-400 font-medium">Remedies requiring immediate replenishment</p>
              </div>
            </div>

            <Link to="/admin/inventory" className="text-xs font-black text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline">
              <span>Restock all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {adminDashboardData.lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                All dispensary inventory levels are optimal
              </div>
            ) : (
              adminDashboardData.lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 hover:bg-rose-50/80 border border-rose-200/70 transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                      <Boxes className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm group-hover:text-rose-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Threshold: {item.threshold} units • Status: <span className="font-bold text-rose-600">{item.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-rose-600 font-display">
                      {item.currentStock} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 5. Tables Section: Recent Orders & Top Selling Remedies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider font-display">
                Recent Orders
              </h3>
              <p className="text-xs text-slate-400 font-medium">Latest patient orders placed in dispensary</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-black text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1 hover:underline">
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {adminDashboardData.recentOrders.length === 0 && orders.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              No orders recorded yet. Live orders will appear here in real-time.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto hidden sm:block">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase tracking-wider text-[10px] font-black border-b border-slate-100">
                      <th className="pb-3 pr-4">Order ID</th>
                      <th className="pb-3 px-4">Patient</th>
                      <th className="pb-3 px-4">Amount</th>
                      <th className="pb-3 pl-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {adminDashboardData.recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3.5 pr-4 font-mono font-black text-slate-900 group-hover:text-brandOrange-600 transition-colors">
                          {ord.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          <span>{ord.customer}</span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-brandOrange-600">
                          ₹{ord.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 pl-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                            ord.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : ord.status === 'Processing'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Recent Orders Cards */}
              <div className="sm:hidden flex flex-col gap-2.5 pt-3">
                {adminDashboardData.recentOrders.map((ord) => (
                  <div
                    key={ord.id + '-card'}
                    className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-slate-900">{ord.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          ord.status === 'Delivered' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : ord.status === 'Processing'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-1">{ord.customer}</p>
                    </div>
                    <span className="font-black text-sm text-brandOrange-600 font-display">
                      ₹{ord.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

{/* Top Selling Remedies */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider font-display">
                Top Selling Remedies
              </h3>
              <p className="text-xs text-slate-400 font-medium">Most requested homeopathic products</p>
            </div>
            <Link to="/admin/products" className="text-xs font-black text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1 hover:underline">
              <span>Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {adminDashboardData.topProducts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                No sales data recorded yet
              </div>
            ) : (
              adminDashboardData.topProducts.map((p) => (
                <div key={p.rank} className="flex items-center justify-between gap-3 text-xs p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                  <div className="flex items-center gap-3 truncate">
                    <span className={`font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      p.rank === 1 ? 'bg-amber-100 text-amber-800' : p.rank === 2 ? 'bg-slate-200 text-slate-700' : 'text-slate-400'
                    }`}>
                      {p.rank}
                    </span>
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0 shadow-sm group-hover:scale-105 transition-transform" />
                    <div className="truncate">
                      <h4 className="font-bold text-slate-900 truncate group-hover:text-brandOrange-600 transition-colors">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold">{p.unitsSold} units sold</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 shrink-0 bg-slate-100/80 px-2.5 py-1 rounded-xl border border-slate-200/60 font-display">
                    {p.revenue}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
