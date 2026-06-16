import { create } from "zustand";

const useChatStore = create((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useChatStore;
