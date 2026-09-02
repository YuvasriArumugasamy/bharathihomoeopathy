export const parseApiError = (error, defaultMessage = "Something went wrong. Please try again.") => {
  if (!error) return defaultMessage;
  if (typeof error === 'string') return error;
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) {
    if (error.message.includes('Network Error')) {
      return "Network connection issue. Working with local mode.";
    }
    return error.message;
  }
  return defaultMessage;
};
