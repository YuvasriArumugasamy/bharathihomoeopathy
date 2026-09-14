import React from 'react';
import { AlertCircle, RotateCcw, Home, PhoneCall } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200/60 shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dr. Bharathi’s Homeo Care</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Something went unexpectedly wrong</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                We encountered an unexpected technical issue. Don't worry — your appointment and order data remain safe.
              </p>
              {this.state.error && (
                <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-xl text-[11px] text-rose-800 font-mono text-left overflow-x-auto max-h-28">
                  {this.state.error.message || String(this.state.error)}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brandOrange-500 to-[#f97316] text-white text-xs font-black shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Refreshing</span>
              </button>

              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('admin_customers_store');
                    localStorage.removeItem('admin_orders_store');
                    localStorage.removeItem('admin_appointments_store');
                    localStorage.removeItem('admin_inventory_store');
                  } catch {}
                  window.location.reload();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Admin Cache</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold active:scale-95 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
              <PhoneCall className="w-3.5 h-3.5 text-brandOrange-500" />
              <span>Need help? Call clinic: </span>
              <a href="tel:+919360577726" className="font-bold text-slate-800 hover:text-brandOrange-600">
                +91 93605 77726
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
