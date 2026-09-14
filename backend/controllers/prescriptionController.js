import Prescription from '../models/Prescription.js';

export const createPrescription = async (req, res, next) => {
  try {
    const {
      prescriptionId,
      appointmentId,
      patient,
      diagnosis,
      remedies = [],
      dietRestrictions = '',
      followUpDate = '',
      notes = '',
      date = new Date().toISOString().slice(0, 10),
      doctor = 'Dr. Bharathi (B.H.M.S, M.D.)',
      doctorRegNo = 'HOM-TN-2016-8941',
      userId,
      userEmail
    } = req.body;

    if (!patient || !patient.name) {
      return res.status(400).json({ success: false, message: 'Patient name is required for prescription.' });
    }

    if (!diagnosis) {
      return res.status(400).json({ success: false, message: 'Clinical diagnosis is required.' });
    }

    const uniqueRxId = prescriptionId || `RX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPrescription = await Prescription.create({
      prescriptionId: uniqueRxId,
      appointmentId,
      user: req.user ? req.user._id : null,
      userId: userId || (req.user ? req.user._id.toString() : ''),
      userEmail: userEmail || patient.email || (req.user ? req.user.email : ''),
      date,
      doctor,
      doctorRegNo,
      patient,
      diagnosis,
      remedies,
      dietRestrictions,
      followUpDate,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Prescription saved successfully in MongoDB',
      data: newPrescription
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPrescriptions = async (req, res, next) => {
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

    const prescriptions = await Prescription.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { prescriptionId: req.params.id }
      ]
    });

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription record not found' });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};
