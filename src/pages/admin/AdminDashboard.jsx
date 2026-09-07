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
  Sparkles
} from 'lucide-react';
import { adminDashboardData } from '../../data/adminDashboardData';

export const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('7 Days');
  const chartPoints = adminDashboardData.salesData[timeFilter] || adminDashboardData.salesData['7 Days'];

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

  // Color theme map for KPI cards
  const kpiStyles = {
    'kpi-1': { border: 'hover:border-emerald-500/50', iconBg: 'bg-emerald-500/10 text-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'kpi-2': { border: 'hover:border-sky-500/50', iconBg: 'bg-sky-500/10 text-sky-600', badgeBg: 'bg-sky-50 text-sky-700 border-sky-200' },
    'kpi-3': { border: 'hover:border-brandOrange-500/50', iconBg: 'bg-brandOrange-500/10 text-brandOrange-600', badgeBg: 'bg-brandOrange-50 text-brandOrange-700 border-brandOrange-200' },
    'kpi-4': { border: 'hover:border-purple-500/50', iconBg: 'bg-purple-500/10 text-purple-600', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
    'kpi-5': { border: 'hover:border-amber-500/50', iconBg: 'bg-amber-500/10 text-amber-600', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
    'kpi-6': { border: 'hover:border-rose-500/50', iconBg: 'bg-rose-500/10 text-rose-600', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' },
    'kpi-7': { border: 'hover:border-blue-500/50', iconBg: 'bg-blue-500/10 text-blue-600', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
    'kpi-8': { border: 'hover:border-amber-400/50', iconBg: 'bg-amber-400/10 text-amber-600', badgeBg: 'bg-amber-50 text-amber-800 border-amber-200' }
  };

  return (
    <div className="space-y-8 pb-8 font-sans">
      
      {/* Premium Hero Header Banner */}
      <div className="relative bg-gradient-to-r from-navy-950 via-[#0a1836] to-navy-900 text-white p-6 sm:p-8 rounded-[2rem] shadow-xl border border-navy-800/80 overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Decorative Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brandOrange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandOrange-500/15 border border-brandOrange-500/30 text-brandOrange-400 font-extrabold text-[10px] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Clinic & Dispensary Sync
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Good Morning, <span className="bg-gradient-to-r from-brandOrange-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Dr. Bharathi Care Admin</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-normal">
            Here is your live real-time overview across consultations, online orders, and dispensary inventory today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brandOrange-500 via-brandOrange-600 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-brandOrange-500/25 transition-all duration-200 active:scale-95 cursor-pointer border border-white/20"
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-2xl text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4.5 h-4.5 text-amber-400" />
            <span>View Calendar</span>
          </Link>
        </div>

      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {adminDashboardData.kpiStats.map((kpi) => {
          const IconComponent = iconMap[kpi.icon] || ShoppingBag;
          const style = kpiStyles[kpi.id] || { border: 'hover:border-slate-300', iconBg: 'bg-slate-100 text-navy-900', badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' };

          return (
            <div 
              key={kpi.id} 
              className={`bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm ${style.border} hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3 group`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <IconComponent className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">{kpi.value}</span>
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${style.badgeBg}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-100">{kpi.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Sales Trend Chart & Order Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-sm space-y-6 flex flex-col justify-between">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brandOrange-50 text-brandOrange-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-lg text-navy-950">Revenue & Order Trends</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Total online remedy orders and patient consultation bookings</p>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center bg-slate-100/80 p-1 rounded-xl gap-1 text-xs font-bold border border-slate-200/60">
              {['7 Days', '30 Days', '90 Days'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    timeFilter === t 
                      ? 'bg-navy-950 text-white shadow-md' 
                      : 'text-slate-600 hover:text-navy-900 hover:bg-white/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-10 pb-3 border-b border-slate-100 relative">
            {chartPoints.map((pt, i) => {
              const maxRev = Math.max(...chartPoints.map(p => p.revenue));
              const heightPercent = Math.round((pt.revenue / maxRev) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Hover Tooltip */}
                  <div className="absolute -top-8 bg-navy-950 text-amber-400 font-extrabold text-[11px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-md z-20 whitespace-nowrap">
                    ₹{pt.revenue.toLocaleString()}
                  </div>

                  {/* Gradient Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-navy-950 via-brandOrange-500 to-amber-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125 shadow-sm"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-bold text-slate-600 mt-1">{pt.label}</span>
                </div>
              );
            })}
          </div>

          {/* Chart Footer Info */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-3 h-3 bg-gradient-to-r from-navy-950 to-brandOrange-500 rounded-full" />
              <span>Remedies & Consultations Combined Revenue</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 font-bold bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Peak Day: Saturday (₹78,000)</span>
            </div>
          </div>

        </div>

        {/* Right: Order Status Distribution */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-navy-950 mb-1">Order Status Breakdown</h3>
            <p className="text-xs text-slate-500">Live summary of active fulfillment pipeline</p>
          </div>

          <div className="space-y-3.5 flex-1 justify-center flex flex-col">
            {[
              { label: 'Pending Confirmation', count: 6, color: 'bg-amber-500' },
              { label: 'Confirmed / Paid', count: 12, color: 'bg-sky-500' },
              { label: 'Dispensary Processing', count: 14, color: 'bg-purple-500' },
              { label: 'Shipped with Courier', count: 18, color: 'bg-indigo-500' },
              { label: 'Successfully Delivered', count: 30, color: 'bg-emerald-500' },
              { label: 'Cancelled / Refunded', count: 4, color: 'bg-rose-500' }
            ].map((st, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{st.label}</span>
                  <span className="font-black text-navy-950">{st.count} orders</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                  <div className={`${st.color} h-full rounded-full transition-all duration-700`} style={{ width: `${(st.count / 84) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/orders"
            className="w-full py-3 bg-navy-950 hover:bg-navy-900 text-white font-extrabold text-xs rounded-xl text-center shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Manage All Orders</span>
            <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Tables Section: Recent Orders & Top Selling Remedies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-navy-950 uppercase tracking-wider">Recent Orders</h3>
              <p className="text-xs text-slate-400 font-medium">Latest patient orders placed in dispensary</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-extrabold text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1 hover:underline">
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider text-[10px] font-black border-b border-slate-100">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {adminDashboardData.recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 font-mono font-black text-navy-950 group-hover:text-brandOrange-600 transition-colors">{ord.id}</td>
                    <td className="py-3.5 font-bold text-slate-800">{ord.customer}</td>
                    <td className="py-3.5 font-black text-brandOrange-600">₹{ord.amount}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        ord.status === 'Delivered' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
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
        </div>

        {/* Top 5 Remedies */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-[2rem] border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-base text-navy-950 uppercase tracking-wider">Top Selling Remedies</h3>
              <p className="text-xs text-slate-400 font-medium">Most requested homeopathic products</p>
            </div>
            <Link to="/admin/products" className="text-xs font-extrabold text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1 hover:underline">
              <span>Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {adminDashboardData.topProducts.map((p) => (
              <div key={p.rank} className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 truncate">
                  <span className="font-black text-slate-400 text-xs w-4">{p.rank}</span>
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200/60 shrink-0 shadow-sm" />
                  <div className="truncate">
                    <h4 className="font-bold text-navy-950 truncate">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{p.unitsSold} units sold</p>
                  </div>
                </div>
                <span className="font-black text-navy-950 shrink-0 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50">{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
