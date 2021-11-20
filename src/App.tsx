import { FC, useEffect, useState } from "react";
import styles from "./app.module.scss";
import { GreetingCard } from "./components/greeting-card";
import { AppointmentForm } from "./components/appointment-form";

export const App: FC = () => {
  const [username, setUsername] = useState("Stranger");

  useEffect(() => {
    setUsername(
      (name) => prompt("Hi there, we like to know your name") || name
    );
  }, []);

  return (
    <div className={styles.app}>
      <GreetingCard username={username} />
      <AppointmentForm username={username} />
    </div>
  );
};
