// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA79g3_ILQyjKzvWUOvEEOf50Ct7DFq5RA",
  authDomain: "health-app-12ef6.firebaseapp.com",
  projectId: "health-app-12ef6",
  storageBucket: "health-app-12ef6.firebasestorage.app",
  messagingSenderId: "615078642821",
  appId: "1:615078642821:web:24d95ef5b03164e85255ec",
  measurementId: "G-DTK15G7H9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app)

export {db, auth}