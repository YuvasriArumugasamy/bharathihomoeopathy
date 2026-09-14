import mongoose from 'mongoose';

const remedyItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String, default: '15 Days' }
});

const prescriptionSchema = new mongoose.Schema({
  prescriptionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  appointmentId: {
    type: String,
    default: '',
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  userId: {
    type: String,
    default: ''
  },
  userEmail: {
    type: String,
    default: '',
    index: true
  },
  date: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    default: 'Dr. Bharathi (B.H.M.S, M.D.)'
  },
  doctorRegNo: {
    type: String,
    default: 'HOM-TN-2016-8941'
  },
  patient: {
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    age: { type: mongoose.Schema.Types.Mixed, default: '' },
    gender: { type: String, default: 'Not specified' }
  },
  diagnosis: {
    type: String,
    required: true
  },
  remedies: [remedyItemSchema],
  dietRestrictions: {
    type: String,
    default: ''
  },
  followUpDate: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
