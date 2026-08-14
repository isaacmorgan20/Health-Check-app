import { create } from "zustand";

const useAgentStore = create((set) => ({
  bookingDraft: null,
  autoSubmit: false,
  setBookingDraft: (draft, autoSubmit = false) =>
    set({ bookingDraft: draft, autoSubmit }),
  clearBookingDraft: () => set({ bookingDraft: null, autoSubmit: false }),
}));

export default useAgentStore;
