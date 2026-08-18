import { create } from "zustand";
import { auth, db } from "../Services/Firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const useAuthStore = create((set) => ({
    user: null,
    profile: null,
    loading: true,

    Register: async ({ name, email, password }) => {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;

        const profileData = {
            uid: user.uid,
            name,
            email: user.email,
            createdAt: Date.now(),
            role: "patient",
        };

        await setDoc(doc(db, "users", user.uid), profileData);

        set({ user, profile: profileData });
    },

    Login: async ({ email, password }) => {
        const userCredential = await signInWithEmailAndPassword( auth, email, password  );
        const user = userCredential.user;

        const snap = await getDoc(doc(db, "users", user.uid));
        const raw = snap.exists() ? snap.data() : null;
        const profileData = raw ? { role: raw.role || "patient", clinicId: raw.clinicId || null, ...raw } : null;

        set({ user, profile: profileData });
    },

    Logout: async () => {
        await signOut(auth);
        set({ user: null, profile: null });
    },

    UpdateProfile: async ({ name }) => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const data = { name };
        await updateDoc(doc(db, "users", currentUser.uid), data);
        set((state) => ({
            profile: state.profile ? { ...state.profile, ...data } : data,
        }));
    },

    ListenToAuth: () => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                set({ user: null, profile: null, loading: false });
                return;
            }
            
            const snap = await getDoc(doc(db, "users", user.uid));
            const raw = snap.exists() ? snap.data() : null;
            const profileData = raw ? { role: raw.role || "patient", clinicId: raw.clinicId || null, ...raw } : null;

            set({ user, profile: profileData, loading: false });
        });
    },

}));

export default useAuthStore;