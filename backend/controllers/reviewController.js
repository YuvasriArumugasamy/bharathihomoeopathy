import Review from '../models/Review.js';

export const getReviews = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const {
      customer,
      product,
      rating,
      title = '',
      content,
      status = 'Approved',
      isFeatured = false
    } = req.body;

    if (!customer || !customer.name) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }

    if (!rating || !content) {
      return res.status(400).json({ success: false, message: 'Rating and review content are required.' });
    }

    const newReview = await Review.create({
      customer,
      product: product || { name: 'Homeopathic Medicine', sku: '' },
      rating: Number(rating),
      title,
      content,
      status,
      isFeatured
    });

    res.status(201).json({
      success: true,
      message: 'Review saved successfully in MongoDB',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const { status, isFeatured, rejectionReason } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      message: `Review updated to ${status}`,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted from MongoDB'
    });
  } catch (error) {
    next(error);
  }
};
