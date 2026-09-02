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
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Boxes,
  Plus
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

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Dispensary & Clinic Overview</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Good Morning, Dr. Bharathi Care Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1">Here is what is happening across consultations and store orders today.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold shadow-sm transition-smooth"
          >
            <Plus className="w-4 h-4 text-brandOrange-400" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white rounded-xl text-xs font-bold shadow-sm transition-smooth"
          >
            <Calendar className="w-4 h-4" />
            <span>View Calendar</span>
          </Link>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminDashboardData.kpiStats.map((kpi) => {
          const IconComponent = iconMap[kpi.icon] || ShoppingBag;
          return (
            <div key={kpi.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className="w-8 h-8 rounded-xl bg-slate-50 text-navy-900 flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-brandOrange-500" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-navy-900">{kpi.value}</span>
                <span className={`text-[11px] font-bold ${kpi.isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {kpi.change}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 font-medium">{kpi.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Sales Trend Chart & Order Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Revenue Trend */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-base text-navy-900">Revenue & Order Trends</h3>
              <p className="text-xs text-slate-400">Total store sales and consultation bookings</p>
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
              {['7 Days', '30 Days', '90 Days'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg transition-smooth ${
                    timeFilter === t ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Bar / Chart Representation */}
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-8 pb-2 border-b border-slate-100">
            {chartPoints.map((pt, i) => {
              const maxRev = Math.max(...chartPoints.map(p => p.revenue));
              const heightPercent = Math.round((pt.revenue / maxRev) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{pt.revenue}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-navy-900 to-brandOrange-500 rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-bold text-slate-600">{pt.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-brandOrange-500 rounded-full" />
              <span>Remedies & Consultations</span>
            </div>
            <span className="font-bold text-navy-900">Highest Volume: Saturday</span>
          </div>
        </div>

        {/* Right: Order Status Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 flex flex-col">
          <h3 className="font-extrabold text-base text-navy-900">Order Status Breakdown</h3>

          <div className="space-y-3 flex-1">
            {[
              { label: 'Pending Confirmation', count: 6, color: 'bg-amber-500' },
              { label: 'Confirmed / Paid', count: 12, color: 'bg-sky-500' },
              { label: 'Dispensary Processing', count: 14, color: 'bg-purple-500' },
              { label: 'Shipped with Courier', count: 18, color: 'bg-indigo-500' },
              { label: 'Successfully Delivered', count: 30, color: 'bg-emerald-500' },
              { label: 'Cancelled / Refunded', count: 4, color: 'bg-rose-500' }
            ].map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{st.label}</span>
                  <span className="font-bold">{st.count} orders</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${st.color} h-full rounded-full`} style={{ width: `${(st.count / 84) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/orders"
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-navy-900 font-bold text-xs rounded-xl text-center transition-smooth"
          >
            Manage All Orders →
          </Link>
        </div>

      </div>

      {/* Tables: Recent Orders & Top Selling Remedies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-navy-900 uppercase tracking-wider">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-brandOrange-600 hover:underline">View all</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                  <th className="pb-2 font-bold">Order ID</th>
                  <th className="pb-2 font-bold">Patient</th>
                  <th className="pb-2 font-bold">Amount</th>
                  <th className="pb-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminDashboardData.recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono font-extrabold text-navy-900">{ord.id}</td>
                    <td className="py-3 font-semibold text-slate-700">{ord.customer}</td>
                    <td className="py-3 font-extrabold text-brandOrange-600">₹{ord.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
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

        {/* Top 5 Products */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-navy-900 uppercase tracking-wider">Top Selling Remedies</h3>
            <Link to="/admin/products" className="text-xs font-bold text-brandOrange-600 hover:underline">Inventory</Link>
          </div>

          <div className="space-y-3">
            {adminDashboardData.topProducts.map((p) => (
              <div key={p.rank} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 truncate">
                  <span className="font-extrabold text-slate-400 w-4">{p.rank}</span>
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-slate-50 shrink-0" />
                  <div className="truncate">
                    <h4 className="font-bold text-navy-900 truncate">{p.name}</h4>
                    <p className="text-[10px] text-slate-400">{p.unitsSold} units sold</p>
                  </div>
                </div>
                <span className="font-extrabold text-navy-900 shrink-0">{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
