import { FC } from "react";
import styles from "./style.module.scss";

export const GreetingCard: FC = () => {
  return (
    <div className={styles.card}>
      <div>Hi there</div>
      <div>Welcome to SofaX</div>
      <div>
        You can make an appointment with our talented designers using the form
        below
      </div>
      <div>Hope to hear from you soon !</div>
    </div>
  );
};
