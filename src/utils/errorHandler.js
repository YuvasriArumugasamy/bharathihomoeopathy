/**
 * Global Error Handler
 * Catches unhandled errors and prevents app crashes
 */

// Store errors for debugging
const errorLog = [];

// Initialize error handlers
export const initializeErrorHandlers = () => {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    const error = {
      type: 'unhandledrejection',
      message: event.reason?.message || 'Unknown error',
      stack: event.reason?.stack,
      timestamp: new Date().toISOString()
    };
    
    errorLog.push(error);
    
    // Prevent default browser error display
    event.preventDefault();
    
    // Log to external service if needed
    logError(error);
  });

  // Catch global JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error || event.message);
    
    const error = {
      type: 'error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack,
      timestamp: new Date().toISOString()
    };
    
    errorLog.push(error);
    
    // Prevent default browser error display for specific errors
    if (event.message && event.message.includes('is not defined')) {
      event.preventDefault();
    }
    
    logError(error);
  });

  // Catch console errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    errorLog.push({
      type: 'console.error',
      message: args.join(' '),
      timestamp: new Date().toISOString()
    });
    originalConsoleError.apply(console, args);
  };
};

// Log error to external service
const logError = (error) => {
  // In production, send to error tracking service
  // Example: Sentry, LogRocket, etc.
  
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics or error tracking
    console.log('Error logged:', error);
    
    // Optional: Send to backend
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(error)
    // }).catch(() => {});
  }
};

// Get all logged errors (for debugging)
export const getErrorLog = () => errorLog;

// Clear error log
export const clearErrorLog = () => {
  errorLog.length = 0;
};

// Export for use in components
export default {
  initializeErrorHandlers,
  getErrorLog,
  clearErrorLog
};
