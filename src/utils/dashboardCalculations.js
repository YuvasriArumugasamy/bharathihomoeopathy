export const calculateRevenueStats = (orders = []) => {
  const totalRevenue = orders.reduce((acc, curr) => {
    if (curr.paymentStatus === 'Paid' || curr.orderStatus === 'Delivered') {
      return acc + (curr.total || 0);
    }
    return acc;
  }, 0);

  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  const processingOrders = orders.filter(o => o.orderStatus === 'Processing').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;

  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders,
    processingOrders,
    deliveredOrders
  };
};
