import { create } from "zustand";
import { db } from "../Services/Firebase";
import { getDocs, addDoc, collection, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import seedPacks from "../Data/pack";

const usePackageStore = create((set) => ({
    packages: [],
    loading: true,

    fetchPackages: async () => {
        try {
            const snap = await getDocs(collection(db, "packages"));
            const data = snap.docs.map((d) => {
                const dd = d.data();
                return { id: d.id, ...dd, seedId: dd.id ?? null };
            });
            const list = data.length ? data : seedPacks.map((p) => ({ ...p, seedId: p.id }));
            set({ packages: list, loading: false });
        } catch {
            set({ packages: seedPacks.map((p) => ({ ...p, seedId: p.id })), loading: false });
        }
    },

    seedPackages: async () => {
        const snap = await getDocs(collection(db, "packages"));
        if (snap.size) return;
        for (const p of seedPacks) {
            await addDoc(collection(db, "packages"), p);
        }
        await usePackageStore.getState().fetchPackages();
    },

    listenToPackages: () => {
        const fallback = seedPacks.map((p) => ({ ...p, seedId: p.id }));
        const unsubscribe = onSnapshot(
            collection(db, "packages"),
            (snap) => {
                const data = snap.docs.map((d) => {
                    const dd = d.data();
                    return { id: d.id, ...dd, seedId: dd.id ?? null };
                });
                set({ packages: data.length ? data : fallback, loading: false });
            },
            () => {
                set({ packages: fallback, loading: false });
            }
        );
        return unsubscribe;
    },

    addPackage: async (pkg) => {
        const ref = await addDoc(collection(db, "packages"), pkg);
        set((s) => ({ packages: [...s.packages, { id: ref.id, ...pkg, seedId: pkg.id ?? null }] }));
    },

    updatePackage: async (id, data) => {
        await updateDoc(doc(db, "packages", id), data);
        set((s) => ({
            packages: s.packages.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
    },

    deletePackage: async (id) => {
        await deleteDoc(doc(db, "packages", id));
        set((s) => ({ packages: s.packages.filter((p) => p.id !== id) }));
    },
}));

export default usePackageStore;