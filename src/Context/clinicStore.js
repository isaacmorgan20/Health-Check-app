import { create } from "zustand";
import { db } from "../Services/Firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const DEFAULTS = {
  name: "Herbal Homeopathic Center",
  location: "12 Independence Avenue, Accra, Ghana",
  phone: "+233 20 123 4567",
  email: "care@herbalhomeopathic.app",
  hours: [
    { day: "Monday - Friday", time: "8:00 AM - 5:00 PM" },
    { day: "Saturday", time: "9:00 AM - 1:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  about: "We are a holistic health center offering natural and homeopathic care.",
  timeSlots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
  weeklyHours: {
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: false,
  },
  blockedDates: [],
};

const useClinicStore = create((set) => ({
  settings: DEFAULTS,
  loading: true,

  saveSettings: async (data) => {
    await setDoc(doc(db, "clinic", "settings"), { ...data, updatedAt: Date.now() });
    set({ settings: { ...data } });
  },

  listenToSettings: () => {
    const unsubscribe = onSnapshot(
      doc(db, "clinic", "settings"),
      (snap) => {
        if (snap.exists()) {
          set({ settings: { ...DEFAULTS, ...snap.data() }, loading: false });
        } else {
          set({ settings: DEFAULTS, loading: false });
        }
      },
      () => {
        set({ settings: DEFAULTS, loading: false });
      }
    );
    return unsubscribe;
  },
}));

export default useClinicStore;
export { DEFAULTS as CLINIC_DEFAULTS };