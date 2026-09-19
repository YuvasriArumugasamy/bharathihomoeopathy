import React from 'react';
import { X, ShoppingCart, Package, AlertCircle } from 'lucide-react';

/**
 * Reorder Confirmation Modal
 * Confirms before adding items to cart from past order
 */

export const ReorderConfirmationModal = ({ order, onConfirm, onCancel }) => {
  if (!order) return null;

  const itemsList = Array.isArray(order.itemsList) && order.itemsList.length > 0
    ? order.itemsList
    : [{ name: order.items, quantity: order.itemsCount || 1, price: order.amount }];

  const totalItems = itemsList.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto animate-in zoom-in-95 fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Reorder Items?</h3>
                <p className="text-xs text-slate-500">From Order #{order.id}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Info Banner */}
            <div className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                <p className="font-semibold mb-1">Before you reorder</p>
                <p className="text-amber-700">
                  Please check product availability and current prices may vary from your previous order.
                </p>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-600" />
                Items to be added ({totalItems})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {itemsList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {item.name || item.title || 'Product'}
                      </p>
                      <p className="text-xs text-slate-500">
                        Quantity: {item.quantity || 1}
                      </p>
                    </div>
                    {item.price && (
                      <div className="text-sm font-bold text-slate-900 ml-3">
                        ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Approximate Total</span>
                <span className="text-lg font-bold text-slate-900">₹{order.amount}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                *Final amount may vary based on current pricing
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-5 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReorderConfirmationModal;
