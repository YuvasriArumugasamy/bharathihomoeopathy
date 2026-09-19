import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Global Error Boundary Component
 * Catches all JavaScript errors and displays user-friendly error page
 * Prevents app crashes and shows recovery options
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorCount: this.state.errorCount + 1
    });

    // Log to external service (optional)
    // this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Send to error tracking service (e.g., Sentry, LogRocket)
    // Example: Sentry.captureException(error, { extra: errorInfo });
    console.log('Error logged:', {
      message: error.toString(),
      stack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleResetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
            
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Something went unexpectedly wrong
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 text-center mb-8">
              We encountered an unexpected technical issue. Don't worry — your appointment and order data remain safe.
            </p>

            {/* Error Message Box */}
            {isDevelopment && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="font-mono text-sm text-red-800 break-all">
                  {error.toString()}
                </p>
                {errorInfo && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-semibold text-red-700 hover:text-red-900">
                      View Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-red-700 overflow-auto max-h-40 bg-red-100 p-2 rounded">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Production Error Message */}
            {!isDevelopment && (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                <p className="font-mono text-sm text-pink-800">
                  Error Code: {error?.name || 'UnknownError'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRefresh}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Try Refreshing
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                Return to Home
              </button>

              {isDevelopment && (
                <button
                  onClick={this.handleResetError}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Reset Error
                </button>
              )}
            </div>

            {/* Support Contact */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                📞 Need help? Call clinic:{' '}
                <a 
                  href="tel:+919360577726" 
                  className="text-orange-600 font-semibold hover:underline"
                >
                  +91 93605 77726
                </a>
              </p>
            </div>

            {/* Error Count (Development only) */}
            {isDevelopment && this.state.errorCount > 1 && (
              <div className="mt-4 text-center text-xs text-gray-500">
                Error occurred {this.state.errorCount} times
              </div>
            )}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
