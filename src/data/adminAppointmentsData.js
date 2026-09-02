export const initialAdminAppointments = [
  {
    id: "demo-apt-1",
    appointmentId: "APT-DEMO-001",
    patient: {
      name: "Rahul Varma",
      email: "rahul.v@example.com",
      phone: "+91 98840 11223"
    },
    appointmentType: "Clinic Visit",
    consultationMode: "Clinic",
    doctor: "Dr. Bharathi",
    date: "2026-08-26",
    time: "09:30 AM",
    status: "Confirmed",
    patientNote: "Seasonal allergy and skin consultation.",
    cancellationReason: "",
    rescheduleReason: "",
    createdAt: "2026-08-24"
  },
  {
    id: "demo-apt-2",
    appointmentId: "APT-DEMO-002",
    patient: {
      name: "Deepa Menon",
      email: "deepa.m@example.com",
      phone: "+91 97909 44556"
    },
    appointmentType: "Online Consultation",
    consultationMode: "Online",
    doctor: "Dr. Bharathi",
    date: "2026-08-26",
    time: "11:00 AM",
    status: "Confirmed",
    patientNote: "Follow-up discussion on digestive wellness drops.",
    cancellationReason: "",
    rescheduleReason: "",
    createdAt: "2026-08-23"
  },
  {
    id: "demo-apt-3",
    appointmentId: "APT-DEMO-003",
    patient: {
      name: "Gopalakrishnan S.",
      email: "gopal.s@example.com",
      phone: "+91 94432 77889"
    },
    appointmentType: "Follow-up Consultation",
    consultationMode: "Clinic",
    doctor: "Dr. Bharathi",
    date: "2026-08-26",
    time: "04:30 PM",
    status: "Pending",
    patientNote: "Routine constitutional review.",
    cancellationReason: "",
    rescheduleReason: "",
    createdAt: "2026-08-25"
  },
  {
    id: "demo-apt-4",
    appointmentId: "APT-DEMO-004",
    patient: {
      name: "Lakshmi Narayanan",
      email: "lakshmi.n@example.com",
      phone: "+91 98412 99001"
    },
    appointmentType: "Clinic Visit",
    consultationMode: "Clinic",
    doctor: "Dr. Bharathi",
    date: "2026-08-28",
    time: "10:00 AM",
    status: "Confirmed",
    patientNote: "General wellness checkup for senior family member.",
    cancellationReason: "",
    rescheduleReason: "",
    createdAt: "2026-08-24"
  },
  {
    id: "demo-apt-5",
    appointmentId: "APT-DEMO-005",
    patient: {
      name: "Venkatesh R.",
      email: "venkat.r@example.com",
      phone: "+91 95000 66778"
    },
    appointmentType: "Online Consultation",
    consultationMode: "Online",
    doctor: "Dr. Bharathi",
    date: "2026-08-22",
    time: "05:00 PM",
    status: "Completed",
    patientNote: "Initial case history taken.",
    cancellationReason: "",
    rescheduleReason: "",
    createdAt: "2026-08-20"
  },
  {
    id: "demo-apt-6",
    appointmentId: "APT-DEMO-006",
    patient: {
      name: "Saravanan P.",
      email: "saravanan.p@example.com",
      phone: "+91 91760 12345"
    },
    appointmentType: "Clinic Visit",
    consultationMode: "Clinic",
    doctor: "Dr. Bharathi",
    date: "2026-08-21",
    time: "06:00 PM",
    status: "Cancelled",
    patientNote: "Requested cancellation due to travel schedule.",
    cancellationReason: "Patient requested reschedule due to outstation travel.",
    rescheduleReason: "",
    createdAt: "2026-08-19"
  }
];
