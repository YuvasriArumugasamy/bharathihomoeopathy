import React, { useState } from 'react';
import { Search, X, Filter, Calendar } from 'lucide-react';

/**
 * Order Search Component
 * Search and filter orders by ID, product name, status, date
 */

export const OrderSearch = ({ orders, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique statuses and months
  const statuses = ['All', ...new Set(orders.map(o => o.status))];
  const months = [
    'All',
    ...new Set(
      orders.map(o => {
        const date = new Date(o.createdAt || o.date);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      })
    ),
  ];

  // Filter logic
  const handleFilter = (query, status, month) => {
    let filtered = orders;

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(q) ||
          order.orderId?.toLowerCase().includes(q) ||
          order.items.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (status !== 'All') {
      filtered = filtered.filter((order) => order.status === status);
    }

    // Month filter
    if (month !== 'All') {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt || order.date);
        const orderMonth = orderDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });
        return orderMonth === month;
      });
    }

    onFilter(filtered);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    handleFilter(value, selectedStatus, selectedMonth);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    handleFilter(searchQuery, status, selectedMonth);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    handleFilter(searchQuery, selectedStatus, month);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedMonth('All');
    setShowFilters(false);
    onFilter(orders);
  };

  const hasActiveFilters = selectedStatus !== 'All' || selectedMonth !== 'All' || searchQuery.trim();

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by Order ID or Product name..."
          className="w-full pl-10 pr-24 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
              title="Clear all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition-colors ${
              showFilters
                ? 'bg-amber-100 text-amber-600'
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
            }`}
            title="Filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Order Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedStatus === status
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Order Month
            </label>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => handleMonthChange(month)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedMonth === month
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-600">
                Showing{' '}
                <span className="font-bold text-amber-600">
                  {
                    orders.filter((o) => {
                      let match = true;
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        match =
                          match &&
                          (o.id.toLowerCase().includes(q) ||
                            o.orderId?.toLowerCase().includes(q) ||
                            o.items.toLowerCase().includes(q));
                      }
                      if (selectedStatus !== 'All') {
                        match = match && o.status === selectedStatus;
                      }
                      if (selectedMonth !== 'All') {
                        const orderDate = new Date(o.createdAt || o.date);
                        const orderMonth = orderDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        });
                        match = match && orderMonth === selectedMonth;
                      }
                      return match;
                    }).length
                  }
                </span>{' '}
                of {orders.length} orders
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSearch;
