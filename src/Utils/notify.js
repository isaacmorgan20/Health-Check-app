const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://backen-1-j6ms.onrender.com";

export const notifyClient = async (appointment, { subject, body }) => {
  try {
    await fetch(`${BACKEND}/notify-booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: appointment.email,
        name: appointment.name,
        package: appointment.package,
        date: appointment.date,
        time: appointment.time,
        reference: appointment.reference || appointment.paymentReference,
        subject,
        body,
      }),
    });
  } catch (error) {
    console.warn("Notification skipped:", error.message);
  }
};