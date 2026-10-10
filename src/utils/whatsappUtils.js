/**
 * Utilities for WhatsApp Click-to-Chat messaging for Clinic Appointments & Orders
 */

export const cleanPhoneForWhatsApp = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  // Default to Indian country code 91 if standard 10 digit number
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
};

export const sendAppointmentWhatsApp = (apt) => {
  const patientName = apt.patient?.name || 'Patient';
  const date = apt.date || 'upcoming date';
  const time = apt.time || 'scheduled time';
  const mode = apt.consultationMode || 'In-Clinic';
  const doctor = apt.doctor || 'Dr. Bharathi';

  // Explicit Unicode characters to ensure 100% clean rendering across all platforms and encodings
  const leaf = '\u{1F33F}';       // 🌿
  const clipboard = '\u{1F4CB}';  // 📋
  const stethoscope = '\u{1FA7A}';// 🩺
  const calendar = '\u{1F4C5}';   // 📅
  const clock = '\u{23F0}';       // ⏰
  const pin = '\u{1F4CD}';         // 📍
  const hospital = '\u{1F3E5}';    // 🏥

  const message = 
`${leaf} *Dr. Bharathi's Homoeo Care* ${leaf}
Dear *${patientName}*,

Your medical consultation appointment has been *CONFIRMED*!

${clipboard} *Appointment ID:* ${apt.appointmentId || apt.id}
${stethoscope} *Doctor:* ${doctor} (Homeopathic Doctor)
${calendar} *Date:* ${date}
${clock} *Time:* ${time}
${pin} *Mode:* ${mode}
${hospital} *Clinic:* Dr. Bharathi's Homeopathic Care & Research Clinic

Kindly arrive 10 minutes prior to your slot. If you need to reschedule, please inform us in advance.

Health & Wellness,
*Dr. Bharathi's Homoeo Care Team*`;

  const phone = cleanPhoneForWhatsApp(apt.patient?.phone);
  // Using api.whatsapp.com/send prevents the wa.me 302 HTTP redirect that mangles Unicode/emojis into ? or 
  const url = phone 
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const sendOrderWhatsApp = (order) => {
  const customerName = order.customer?.name || order.shippingAddress?.fullName || 'Patient';
  const orderNumber = order.orderId || order.orderNumber || order.id;
  const status = order.orderStatus || 'Confirmed';
  const courier = order.courierPartner || 'ST Courier / India Post';
  const tracking = order.trackingNumber || 'Tracking will be shared shortly';
  const total = Number(order.total || 0).toLocaleString('en-IN');

  const leaf = '\u{1F33F}';
  const box = '\u{1F4E6}';
  const truck = '\u{1F69A}';
  const search = '\u{1F50D}';
  const check = '\u{2705}';
  const clipboard = '\u{1F4CB}';
  const money = '\u{1F4B0}';
  const card = '\u{1F4B3}';

  let statusMsg = '';
  if (status === 'Shipped') {
    statusMsg = 
`${box} Your homeopathic remedy package has been *DISPATCHED*!
${truck} *Courier Partner:* ${courier}
${search} *Tracking No:* ${tracking}`;
  } else if (status === 'Delivered') {
    statusMsg = `${check} Your remedy package has been *DELIVERED*. Wishing you speedy wellness!`;
  } else {
    statusMsg = `${check} Your order has been *CONFIRMED* and is being packed in our certified dispensary.`;
  }

  const message = 
`${leaf} *Dr. Bharathi's Dispensary Order Update* ${leaf}
Dear *${customerName}*,

${statusMsg}

${clipboard} *Order ID:* ${orderNumber}
${money} *Total Amount:* ₹${total}
${card} *Payment Status:* ${order.paymentStatus || 'Paid'}

For dosage or medicine queries, please reach out to our clinic desk.

Warm Regards,
*Dr. Bharathi's Homeopathic Pharmacy*`;

  const phone = cleanPhoneForWhatsApp(order.customer?.phone || order.shippingAddress?.phone);
  const url = phone 
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
