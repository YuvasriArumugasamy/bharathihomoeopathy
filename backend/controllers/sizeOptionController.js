import SizeOption from '../models/SizeOption.js';

export const getAdminSizeOptions = async (_req, res, next) => {
  try {
    const data = await SizeOption.find().sort({ sortOrder: 1, name: 1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createSizeOption = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ success: false, message: 'Size name is required.' });

    const existing = await SizeOption.find();
    if (existing.some(option => option.name.toLowerCase() === name.toLowerCase())) {
      return res.status(409).json({ success: false, message: 'This size already exists.' });
    }

    const data = await SizeOption.create({ name });
    res.status(201).json({ success: true, message: 'Size added successfully.', data });
  } catch (error) {
    next(error);
  }
};

export const updateSizeOption = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ success: false, message: 'Size name is required.' });

    const current = await SizeOption.findById(req.params.id);
    if (!current) return res.status(404).json({ success: false, message: 'Size not found.' });

    const otherOptions = await SizeOption.find({ _id: { $ne: current._id } });
    if (otherOptions.some(option => option.name.toLowerCase() === name.toLowerCase())) {
      return res.status(409).json({ success: false, message: 'This size already exists.' });
    }

    current.name = name;
    const data = await current.save();
    res.status(200).json({ success: true, message: 'Size updated successfully.', data });
  } catch (error) {
    next(error);
  }
};

export const deleteSizeOption = async (req, res, next) => {
  try {
    const deleted = await SizeOption.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Size not found.' });
    res.status(200).json({ success: true, message: 'Size deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
