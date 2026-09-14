import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res, next) => {
  try {
    const {
      appointmentId,
      patient,
      concern,
      doctor = 'Dr. Bharathi (Homeopathic Doctor)',
      consultationMode = 'In-Clinic',
      date,
      time,
      status = 'Pending',
      notes = '',
      attachment = '',
      attachmentName = '',
      userEmail,
      userId
    } = req.body;

    if (!patient || !patient.name || !patient.phone) {
      return res.status(400).json({ success: false, message: 'Patient name and phone are required.' });
    }

    if (!concern || !date || !time) {
      return res.status(400).json({ success: false, message: 'Concern, date, and time slot are required.' });
    }

    const uniqueAppointmentId = appointmentId || `APT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newAppointment = await Appointment.create({
      appointmentId: uniqueAppointmentId,
      user: req.user ? req.user._id : null,
      userId: userId || (req.user ? req.user._id.toString() : ''),
      userEmail: userEmail || patient.email || (req.user ? req.user.email : ''),
      patient,
      concern,
      doctor,
      consultationMode,
      date,
      time,
      status,
      notes,
      attachment,
      attachmentName
    });

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully in MongoDB',
      data: newAppointment
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    const query = {};
    if (req.user) {
      query.$or = [
        { user: req.user._id },
        { userId: req.user._id.toString() },
        { userEmail: (req.user.email || '').toLowerCase() },
        { 'patient.email': (req.user.email || '').toLowerCase() }
      ];
    } else if (req.query.email) {
      const email = req.query.email.trim().toLowerCase();
      query.$or = [
        { userEmail: email },
        { 'patient.email': email }
      ];
    } else {
      return res.status(200).json({ success: true, data: [] });
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }
    if (req.query.date) {
      filter.date = req.query.date;
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};
