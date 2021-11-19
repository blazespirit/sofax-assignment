import { FC } from "react";
import styles from "./app.module.scss";
import { GreetingCard } from "./components/greeting-card";
import { AppointmentForm } from "./components/appointment-form";

export const App: FC = () => (
  <div className={styles.app}>
    <GreetingCard />
    <AppointmentForm />
  </div>
);
