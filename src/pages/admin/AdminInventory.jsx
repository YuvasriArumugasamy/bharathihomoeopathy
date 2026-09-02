import React, { useState } from 'react';
import { Boxes, AlertTriangle, ArrowUpDown, History, Plus, Minus, Check, X } from 'lucide-react';
import { initialAdminInventory, initialInventoryHistory } from '../../data/adminInventoryData';
import { useToast } from '../../context/ToastContext';

export const AdminInventory = () => {
  const { showToast } = useToast();
  const [inventory, setInventory] = useState(initialAdminInventory);
  const [history, setHistory] = useState(initialInventoryHistory);
  const [adjustModalItem, setAdjustModalItem] = useState(null);
  const [adjustType, setAdjustType] = useState('Add Stock');
  const [adjustQty, setAdjustQty] = useState(5);
  const [adjustReason, setAdjustReason] = useState('Certified batch replenishment');

  const totalStockUnits = inventory.reduce((a, b) => a + b.currentStock, 0);
  const lowStockCount = inventory.filter(i => i.currentStock > 0 && i.currentStock <= i.lowStockThreshold).length;
  const outOfStockCount = inventory.filter(i => i.currentStock === 0).length;

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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Dispensary Stock Control</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Inventory Management</h1>
          <p className="text-xs text-slate-500">Monitor stock balance, reserve units, and log inventory batch adjustments.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Formulations in Stock</span>
          <p className="text-2xl font-extrabold text-navy-900 mt-1">{totalStockUnits} units</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Low Stock Warnings</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{lowStockCount} remedies</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Out of Stock</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{outOfStockCount} remedies</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <th className="py-3 px-4 font-bold">Formulation</th>
                <th className="py-3 px-4 font-bold">SKU</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Current Stock</th>
                <th className="py-3 px-4 font-bold">Reserved</th>
                <th className="py-3 px-4 font-bold">Available</th>
                <th className="py-3 px-4 font-bold text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={inv.image} alt={inv.productName} className="w-9 h-9 rounded-xl object-cover bg-slate-100" />
                      <span className="font-bold text-navy-900">{inv.productName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{inv.sku}</td>
                  <td className="py-3 px-4 text-slate-600 font-semibold">{inv.category}</td>
                  <td className="py-3 px-4">
                    <span className={`font-extrabold ${inv.currentStock <= 0 ? 'text-rose-600' : inv.currentStock <= inv.lowStockThreshold ? 'text-amber-600' : 'text-slate-800'}`}>
                      {inv.currentStock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{inv.reservedStock}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{inv.availableStock}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setAdjustModalItem(inv)}
                      className="px-3 py-1.5 bg-brandOrange-50 hover:bg-brandOrange-100 text-brandOrange-600 font-bold rounded-lg transition-smooth"
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

      {/* History Log */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-brandOrange-500" />
          <span>Recent Inventory Adjustment Logs</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {history.slice(0, 5).map((h) => (
            <div key={h.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-bold text-navy-900">{h.productName}</span>
                <p className="text-[11px] text-slate-400 font-medium">{h.adjustmentType} • {h.reason}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-600">{h.previousStock} → <strong>{h.newStock}</strong></span>
                <span className="text-[10px] text-slate-400">{h.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-navy-900 text-sm">Stock Adjustment</h3>
            <p className="text-xs text-slate-500 font-semibold">{adjustModalItem.productName} (Current: {adjustModalItem.currentStock})</p>

            <form onSubmit={handleConfirmAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adjustment Action</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  <option value="Add Stock">Add Stock (+) </option>
                  <option value="Remove Stock">Remove Damaged/Expired (-) </option>
                  <option value="Set Stock">Set Exact Stock (=) </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Note</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. New certified dispensary batch received"
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalItem(null)}
                  className="flex-1 py-2 bg-slate-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-brandOrange-500 text-white font-bold rounded-xl"
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
