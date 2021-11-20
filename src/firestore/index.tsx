import { format } from "date-fns";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";

initializeApp({
  // these configuration should be hidden for security reason,
  // but for the sake of simplicity, I will just leave it here (temporarly)
  apiKey: "AIzaSyA6L3K3xCBSYUPap58OXaaadAUPucEV9Dc",
  authDomain: "sofax-appointment.firebaseapp.com",
  projectId: "sofax-appointment",
});

const db = getFirestore();

export const createAppointment = async (appointmentDate: Date, who: string) => {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      who,
      appointmentDate: Timestamp.fromDate(appointmentDate),
      createOn: serverTimestamp(),
    });
    console.log(`Appointment created (ID: ${docRef.id})`);
  } catch (e) {
    console.error("Error creating appointment: ", e);
  }
};

export const getAppointmentsQueryForDateRange = (
  startDate: Date,
  endDate: Date
) => {
  const appointmentsRef = collection(db, "appointments");

  return query(
    appointmentsRef,
    where("appointmentDate", ">=", startDate),
    where("appointmentDate", "<=", endDate)
  );
};

export type AppointmentDoc = {
  appointmentDate: Timestamp;
  createdOn: Timestamp;
  who: string;
};

// helper function to convert Firestore `Timestamp` to date string (eg. '20201205')
export const convertFirestoreTimestampToDateString = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  return format(date, "yyyyMMdd");
};
