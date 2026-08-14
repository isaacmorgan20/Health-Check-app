import { create } from "zustand";
import { db } from "../Services/Firebase";
import { getDocs, addDoc, collection, deleteDoc, updateDoc, doc, query, where, onSnapshot } from "firebase/firestore";

const useUserStore = create((set) => ({
    users: [],
    profiles: [],

    fetchUser: async () => {
        const snapShot = await getDocs(collection(db, "users"));
        const userData = snapShot.docs.map((docSnap) => ({
            id: docSnap.id, ...docSnap.data()
        }))
        set({ users: userData })
    },

    fetchUserByUid: async (uid) => {
        if (!uid) {
            set({ users: [] });
            return;
        }
        const q = query(collection(db, "users"), where("userUid", "==", uid));
        const snapShot = await getDocs(q);
        const userData = snapShot.docs.map((docSnap) => ({
            id: docSnap.id, ...docSnap.data()
        }))
        set({ users: userData })
    },

    fetchAppointments: async () => {
        const snapShot = await getDocs(collection(db, "users"));
        const userData = snapShot.docs
            .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
            .filter((doc) => !doc.uid);
        set({ users: userData })
    },

    fetchProfiles: async () => {
        const snapShot = await getDocs(collection(db, "users"));
        const profiles = snapShot.docs
            .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
            .filter((doc) => doc.uid);
        set({ profiles: profiles })
    },

    listenToUsers: () => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapShot) => {
            const all = snapShot.docs.map((docSnap) => ({
                id: docSnap.id, ...docSnap.data()
            }));
            set({
                users: all.filter((doc) => !doc.uid),
                profiles: all.filter((doc) => doc.uid),
            });
        });
        return unsubscribe;
    },

    addNewUser: async (user) => {
        const docRef = await addDoc(collection(db, "users"), user)
        set((state) => ({
            users: [...state.users, {id: docRef.id, ...user}]
        }))
        return docRef.id
    },
    
    deleteUser: async(id) => {
        const userRef = doc(db, "users", id)
        await deleteDoc(userRef)
        set((state) => ({
            users: state.users.filter((user) => user.id !== id)
        }))
    },

    updateUser: async(id, userData) => {
        const userRef = doc(db, "users", id)
        await updateDoc(userRef, userData)
        set((state) => ({
            users: state.users.map((user) => user.id === id ? {...user, ...userData} : user) 
        }))
    },
}));

export default useUserStore;