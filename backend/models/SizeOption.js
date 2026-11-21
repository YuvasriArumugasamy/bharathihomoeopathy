import mongoose from 'mongoose';

const sizeOptionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('SizeOption', sizeOptionSchema);
