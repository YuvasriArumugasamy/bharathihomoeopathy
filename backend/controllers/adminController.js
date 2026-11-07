import Order from '../models/Order.js';
import Appointment from '../models/Appointment.js';
import Customer from '../models/Customer.js';
import Cart from '../models/Cart.js';
import Enquiry from '../models/Enquiry.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

export const resetTestData = async (req, res, next) => {
  try {
    const { includeProductsAndCategories } = req.body || {};

    const [ordersResult, aptsResult, customersResult, cartsResult, enquiriesResult, reviewsResult] = await Promise.all([
      Order.deleteMany({}),
      Appointment.deleteMany({}),
      Customer.deleteMany({}),
      Cart.deleteMany({}),
      Enquiry.deleteMany({}),
      Review.deleteMany({}),
      // Delete non-admin test users so customer logins are wiped
      User.deleteMany({ role: { $ne: 'admin' }, email: { $ne: 'admin@drbharathi.com' } })
    ]);

    let productsCount = 0;
    let categoriesCount = 0;

    if (includeProductsAndCategories) {
      const [prodRes, catRes] = await Promise.all([
        Product.deleteMany({}),
        Category.deleteMany({})
      ]);
      productsCount = prodRes.deletedCount || 0;
      categoriesCount = catRes.deletedCount || 0;
    } else {
      // Clean up known junk test categories like 'kjds' and test product 'mn'
      await Category.deleteMany({
        $or: [
          { name: { $regex: /^kjds/i } },
          { slug: { $regex: /^kjds/i } },
          { name: { $regex: /^test/i } }
        ]
      });
      await Product.deleteMany({
        $or: [
          { name: { $regex: /^mn$/i } },
          { slug: { $regex: /^mn$/i } },
          { name: { $regex: /^test/i } }
        ]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cloud database test data wiped successfully. Project ready for client!',
      data: {
        deletedOrders: ordersResult.deletedCount,
        deletedAppointments: aptsResult.deletedCount,
        deletedCustomers: customersResult.deletedCount,
        deletedCarts: cartsResult.deletedCount,
        deletedEnquiries: enquiriesResult.deletedCount,
        deletedReviews: reviewsResult.deletedCount,
        deletedProducts: productsCount,
        deletedCategories: categoriesCount
      }
    });
  } catch (error) {
    next(error);
  }
};
