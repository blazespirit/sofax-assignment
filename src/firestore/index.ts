import { format } from "date-fns";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
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
    console.info(`Appointment created (ID: ${docRef.id})`);
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

export const getAppointmentsQueryByUsername = (username: string) => {
  const appointmentsRef = collection(db, "appointments");

  return query(appointmentsRef, where("who", "==", username));
};

export const deleteAppointmentById = async (documentID: string) => {
  const appointmentsRef = collection(db, "appointments");
  const document = doc(appointmentsRef, documentID);

  await deleteDoc(document);
};

export type AppointmentDoc = {
  appointmentDate: Timestamp;
  createdOn: Timestamp;
  who: string;
};

// helper function to convert Firestore `Timestamp` to date string (eg. '20201205')
export const convertFirestoreTimestampToDateNumberString = (
  timestamp: Timestamp
) => {
  const date = timestamp.toDate();
  return format(date, "yyyyMMdd");
};

// helper function to convert Firestore `Timestamp` to date string (eg. '20 April 2021 @ 4pm')
export const convertFirestoreTimestampToDateString = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  return format(date, "do MMMM yyyy");
};

// helper function to convert Firestore `Timestamp` to time string (eg. '4:00 PM')
export const convertFirestoreTimestampToTimeString = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  return format(date, "h:mm a");
};
