import Customer from '../models/Customer.js';

export const getCustomers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
        { customerId: regex }
      ];
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateCustomer = async (req, res, next) => {
  try {
    const {
      customerId,
      firstName,
      lastName = '',
      email = '',
      phone,
      city = 'Chennai',
      state = 'Tamil Nadu',
      ordersCount = 0,
      totalSpent = 0,
      status = 'Active',
      joinedDate,
      notes = ''
    } = req.body;

    if (!firstName || !phone) {
      return res.status(400).json({ success: false, message: 'First name and phone number are required.' });
    }

    const query = [];
    if (customerId) query.push({ customerId });
    if (phone) query.push({ phone });
    if (email) query.push({ email });

    let customer = await Customer.findOne({ $or: query });

    if (customer) {
      customer.firstName = firstName || customer.firstName;
      customer.lastName = lastName || customer.lastName;
      customer.city = city || customer.city;
      customer.state = state || customer.state;
      if (ordersCount) customer.ordersCount = ordersCount;
      if (totalSpent) customer.totalSpent = totalSpent;
      if (status) customer.status = status;
      if (notes) customer.notes = notes;
      await customer.save();
    } else {
      const generatedId = customerId || `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
      customer = await Customer.create({
        customerId: generatedId,
        user: req.user ? req.user._id : null,
        firstName,
        lastName,
        email,
        phone,
        city,
        state,
        ordersCount,
        totalSpent,
        status,
        joinedDate: joinedDate || new Date().toISOString().slice(0, 10),
        notes
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer profile synced with MongoDB',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { customerId: req.params.id };
    const customer = await Customer.findOneAndUpdate(
      query,
      { status },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({
      success: true,
      message: `Customer status updated to ${status}`,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};
