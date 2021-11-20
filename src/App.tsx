import { FC, useEffect, useState } from "react";
import styles from "./app.module.scss";
import { GreetingCard } from "./components/greeting-card";
import { AppointmentForm } from "./components/appointment-form";
import { AppointmentList } from "./components/appointment-list";
import { AppointmentDoc, getAppointmentsQueryByUsername } from "./firestore";
import { onSnapshot } from "@firebase/firestore";

export type AppointmentDocWithId = AppointmentDoc & { id: string };

export const App: FC = () => {
  const [username, setUsername] = useState("Stranger");
  const [appointments, setAppointments] = useState<AppointmentDocWithId[]>([]);

  useEffect(() => {
    setUsername(
      (name) => prompt("Hi there, we like to know your name") || name
    );
  }, []);

  useEffect(() => {
    const appointmentsQuery = getAppointmentsQueryByUsername(username);

    onSnapshot(appointmentsQuery, (querySnapshot) => {
      const allAppointmentsByUser: AppointmentDocWithId[] = [];

      querySnapshot.forEach((doc) => {
        allAppointmentsByUser.push({
          id: doc.id,
          ...doc.data(),
        } as AppointmentDocWithId);
      });

      setAppointments(allAppointmentsByUser);
    });
  }, [username]);

  return (
    <div className={styles.app}>
      <GreetingCard
        username={username}
        appointmentCount={appointments.length}
      />
      {appointments.length > 0 && (
        <AppointmentList appointments={appointments} />
      )}
      <AppointmentForm username={username} />
    </div>
  );
};
