import { create } from "zustand";
import { auth, db } from "../Services/Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
        };

        await setDoc(doc(db, "users", user.uid), profileData);

        set({ user, profile: profileData });
    },

    Login: async ({ email, password }) => {
        const userCredential = await signInWithEmailAndPassword( auth, email, password  );
        const user = userCredential.user;

        const snap = await getDoc(doc(db, "users", user.uid));
        const profileData = snap.exists() ? snap.data() : null;

        set({ user, profile: profileData });
    },

    Logout: async () => {
        await signOut(auth);
        set({ user: null, profile: null });
    },

    ListenToAuth: () => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                set({ user: null, profile: null, loading: false });
                return;
            }
            
            const snap = await getDoc(doc(db, "users", user.uid));
            const profileData = snap.exists() ? snap.data() : null;

            set({ user, profile: profileData, loading: false });
        });
    },

}));

export default useAuthStore;