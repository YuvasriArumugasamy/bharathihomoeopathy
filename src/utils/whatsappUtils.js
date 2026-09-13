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

  const message = 
`🌿 *Dr. Bharathi's Homoeo Care* 🌿
Dear *${patientName}*,

Your medical consultation appointment has been *CONFIRMED*!

📋 *Appointment ID:* ${apt.appointmentId || apt.id}
👨‍⚕️ *Doctor:* ${doctor}
📅 *Date:* ${date}
⏰ *Time:* ${time}
📍 *Mode:* ${mode}
🏥 *Clinic:* Dr. Bharathi's Homeopathic Care & Research Clinic

Kindly arrive 10 minutes prior to your slot. If you need to reschedule, please inform us in advance.

Health & Wellness,
*Dr. Bharathi's Homoeo Care Team*`;

  const phone = cleanPhoneForWhatsApp(apt.patient?.phone);
  const url = phone 
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const sendOrderWhatsApp = (order) => {
  const customerName = order.customer?.name || order.shippingAddress?.fullName || 'Patient';
  const orderNumber = order.orderId || order.orderNumber || order.id;
  const status = order.orderStatus || 'Confirmed';
  const courier = order.courierPartner || 'ST Courier / India Post';
  const tracking = order.trackingNumber || 'Tracking will be shared shortly';
  const total = Number(order.total || 0).toLocaleString('en-IN');

  let statusMsg = '';
  if (status === 'Shipped') {
    statusMsg = 
`📦 Your homeopathic remedy package has been *DISPATCHED*!
🚚 *Courier Partner:* ${courier}
🔍 *Tracking No:* ${tracking}`;
  } else if (status === 'Delivered') {
    statusMsg = `✅ Your remedy package has been *DELIVERED*. Wishing you speedy wellness!`;
  } else {
    statusMsg = `✅ Your order has been *CONFIRMED* and is being packed in our certified dispensary.`;
  }

  const message = 
`🌿 *Dr. Bharathi's Dispensary Order Update* 🌿
Dear *${customerName}*,

${statusMsg}

📋 *Order ID:* ${orderNumber}
💰 *Total Amount:* ₹${total}
💳 *Payment Status:* ${order.paymentStatus || 'Paid'}

For dosage or medicine queries, please reach out to our clinic desk.

Warm Regards,
*Dr. Bharathi's Homeopathic Pharmacy*`;

  const phone = cleanPhoneForWhatsApp(order.customer?.phone || order.shippingAddress?.phone);
  const url = phone 
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
