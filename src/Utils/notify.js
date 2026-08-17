const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export const verifyPayment = async (reference, token) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${BACKEND}/verify-payment`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reference }),
    });
    return await res.json();
  } catch (error) {
    console.warn("Verification skipped:", error.message);
    return { verified: null };
  }
};

export const notifyClient = async (appointment, { subject, body }, token) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    await fetch(`${BACKEND}/notify-booking`, {
      method: "POST",
      headers,
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