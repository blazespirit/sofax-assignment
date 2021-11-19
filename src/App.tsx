import logo from "./logo.svg";
import { FC } from "react";
import styles from "./app.module.scss";
import { GreetingCard } from "./components/greeting-card";

export const App: FC = () => (
  <div className={styles.app}>
    <GreetingCard />
  </div>
);
