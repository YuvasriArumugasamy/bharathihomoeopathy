import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  ArrowUpDown, 
  History, 
  Plus, 
  Minus, 
  Check, 
  X, 
  Sparkles, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Layers,
  Search
} from 'lucide-react';
import { initialAdminInventory, initialInventoryHistory } from '../../data/adminInventoryData';
import { useToast } from '../../context/ToastContext';

export const AdminInventory = () => {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState(initialAdminInventory);
  const [history, setHistory] = useState(initialInventoryHistory);
  const [search, setSearch] = useState('');
  const [adjustModalItem, setAdjustModalItem] = useState(null);
  const [adjustType, setAdjustType] = useState('Add Stock');
  const [adjustQty, setAdjustQty] = useState(5);
  const [adjustReason, setAdjustReason] = useState('Certified batch replenishment');

  const totalStockUnits = inventory.reduce((a, b) => a + b.currentStock, 0);
  const lowStockCount = inventory.filter(i => i.currentStock > 0 && i.currentStock <= i.lowStockThreshold).length;
  const outOfStockCount = inventory.filter(i => i.currentStock === 0).length;

  const filteredInventory = inventory.filter(inv => 
    inv.productName.toLowerCase().includes(search.toLowerCase()) || 
    inv.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmAdjustment = (e) => {
    e.preventDefault();
    if (!adjustModalItem || adjustQty <= 0) return;

    let newStock = adjustModalItem.currentStock;
    if (adjustType === 'Add Stock') newStock += adjustQty;
    else if (adjustType === 'Remove Stock') newStock = Math.max(0, newStock - adjustQty);
    else if (adjustType === 'Set Stock') newStock = adjustQty;

    setInventory(prev => prev.map(item => item.id === adjustModalItem.id ? {
      ...item,
      currentStock: newStock,
      availableStock: Math.max(0, newStock - item.reservedStock),
      lastUpdated: new Date().toISOString().slice(0, 10)
    } : item));

    const historyRecord = {
      id: 'inv-hist-' + Date.now(),
      productId: adjustModalItem.productId,
      productName: adjustModalItem.productName,
      sku: adjustModalItem.sku,
      adjustmentType: adjustType,
      quantity: adjustQty,
      previousStock: adjustModalItem.currentStock,
      newStock,
      reason: adjustReason,
      createdAt: 'Just now'
    };

    setHistory(prev => [historyRecord, ...prev]);
    setAdjustModalItem(null);
    showToast(`Inventory updated for ${adjustModalItem.productName}`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. Hero Header Banner */}
      <div className="relative bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-7 sm:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-900 font-black text-[10.5px] uppercase tracking-wider shadow-md border border-white">
              <Boxes className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
              Dispensary Stock Control & Audits
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-900 font-black text-xs shadow-md border border-white">
              {inventory.length} Tracked Formulations
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Dispensary Inventory Control
          </h1>
          <p className="text-white text-xs sm:text-sm font-bold max-w-xl leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
            Monitor real-time dispensary reserves, set safety stock replenishment thresholds, and record batch adjustments.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="px-5 py-3.5 bg-white text-slate-900 rounded-2xl shadow-xl border border-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Units</div>
              <div className="text-lg font-black text-slate-950 font-display">{totalStockUnits.toLocaleString()} in Stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI Stock Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="relative bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider font-display">
              Total In Stock
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {totalStockUnits.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">Across {inventory.length} formulations</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <Boxes className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        <div className="relative bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-amber-200/90 shadow-sm flex items-center justify-between overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-amber-600 uppercase tracking-wider font-display">
              Low Stock Warnings
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-display">
              {lowStockCount}
            </div>
            <p className="text-[11px] text-amber-700/80 font-semibold">Reorder threshold reached</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        <div className="relative bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-rose-200/90 shadow-sm flex items-center justify-between overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider font-display">
              Out of Stock
            </span>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 font-display">
              {outOfStockCount}
            </div>
            <p className="text-[11px] text-rose-700/80 font-semibold">Immediate replenishment needed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search formulation by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner font-medium placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <span className="text-xs text-slate-500 font-bold">
          Showing <span className="text-slate-900 font-black">{filteredInventory.length}</span> items
        </span>
      </div>

      {/* 4. Luxury Inventory Table */}
      <div className="bg-white rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/90 text-slate-400 uppercase tracking-wider text-[10px] font-black border-b border-slate-100">
                <th className="py-3.5 px-5">Formulation</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Reserved</th>
                <th className="py-3.5 px-4">Available</th>
                <th className="py-3.5 px-5 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90">
              {filteredInventory.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img 
                        src={inv.image} 
                        alt={inv.productName} 
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0 shadow-xs group-hover:scale-105 transition-transform" 
                      />
                      <span className="font-extrabold text-slate-900 group-hover:text-brandOrange-600 transition-colors">
                        {inv.productName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                    {inv.sku}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {inv.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-black text-sm font-display ${
                      inv.currentStock <= 0 
                        ? 'text-rose-600' 
                        : inv.currentStock <= inv.lowStockThreshold 
                        ? 'text-amber-600' 
                        : 'text-slate-900'
                    }`}>
                      {inv.currentStock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-bold">
                    {inv.reservedStock}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-black text-emerald-600 font-display text-sm">
                      {inv.availableStock}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setAdjustModalItem(inv)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-brandOrange-50 to-amber-50 hover:from-brandOrange-100 hover:to-amber-100 text-brandOrange-700 font-black rounded-xl border border-brandOrange-200/80 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Inventory Adjustment Audit History Logs */}
      <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <History className="w-4 h-4 text-brandOrange-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-display">
                Dispensary Batch Adjustment Audit Trail
              </h3>
              <p className="text-xs text-slate-400 font-medium">Recent modifications logged by dispensary pharmacist</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {history.slice(0, 5).map((h) => (
            <div key={h.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/60 p-2 rounded-xl transition-colors">
              <div>
                <span className="font-extrabold text-slate-900 text-sm">{h.productName}</span>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  <span className="font-bold text-brandOrange-600">{h.adjustmentType}</span> • Reason: {h.reason}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  {h.previousStock} → <strong className="text-slate-900">{h.newStock} units</strong>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{h.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Stock Adjustment Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-brandOrange-500" />
                <h3 className="font-black text-slate-900 text-base font-display">Stock Adjustment</h3>
              </div>
              <button onClick={() => setAdjustModalItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-0.5">
              <p className="font-extrabold text-slate-900">{adjustModalItem.productName}</p>
              <p className="text-slate-500">Current Balance: <strong className="text-brandOrange-600">{adjustModalItem.currentStock} units</strong></p>
            </div>

            <form onSubmit={handleConfirmAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Adjustment Action</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 cursor-pointer shadow-2xs"
                >
                  <option value="Add Stock">Add Stock (+) </option>
                  <option value="Remove Stock">Remove Damaged/Expired (-) </option>
                  <option value="Set Stock">Set Exact Stock Count (=) </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Quantity (Units)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 focus:outline-none focus:border-brandOrange-500 text-sm shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Reason / Batch Memo</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Certified batch replenishment"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 shadow-inner"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalItem(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-md shadow-brandOrange-500/25 transition-all cursor-pointer"
                >
                  Apply Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminInventory;
