import { FC } from "react";
import styles from "./style.module.scss";

type Props = {
  username: string;
  appointmentCount: number;
};

export const GreetingCard: FC<Props> = (props) => {
  const { username, appointmentCount } = props;

  return (
    <div className={styles.card}>
      <div className={styles.greeting}>Hi {username},</div>
      <div>Welcome to SofaX</div>
      {appointmentCount > 0 ? (
        <>
          <div>
            We see that you have {appointmentCount} appointment(s) with us
          </div>
          <div>Hope to see you soon !</div>
        </>
      ) : (
        <>
          <div>
            You can make an appointment with our talented designers using the
            form below.
          </div>
          <div>Hope to hear from you soon !</div>
        </>
      )}
    </div>
  );
};
