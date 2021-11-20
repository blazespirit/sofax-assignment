import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

initializeApp({
  // these configuration should be hidden for security reason,
  // but for the sake of simplicity, I will just leave it here (temporarly)
  apiKey: "AIzaSyA6L3K3xCBSYUPap58OXaaadAUPucEV9Dc",
  authDomain: "sofax-appointment.firebaseapp.com",
  projectId: "sofax-appointment",
});

export const db = getFirestore();
