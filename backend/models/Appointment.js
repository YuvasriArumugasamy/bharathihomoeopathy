import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: true,
    unique: true,
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
  patient: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    age: { type: String, default: 'Adult' },
    gender: { type: String, default: 'Not specified' }
  },
  concern: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    default: 'Dr. Bharathi (Homeopathic Doctor)'
  },
  consultationMode: {
    type: String,
    enum: ['In-Clinic', 'Online', 'Video Consultation', 'Audio Consultation'],
    default: 'In-Clinic'
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
    index: true
  },
  notes: {
    type: String,
    default: ''
  },
  attachment: {
    type: String,
    default: ''
  },
  attachmentName: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
