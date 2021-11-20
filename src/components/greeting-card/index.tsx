import { FC } from "react";
import styles from "./style.module.scss";

type Props = {
  username: string;
};

export const GreetingCard: FC<Props> = (props) => {
  const { username } = props;

  return (
    <div className={styles.card}>
      <div>Hi {username},</div>
      <div>Welcome to SofaX</div>
      <div>
        You can make an appointment with our talented designers using the form
        below.
      </div>
      <div>Hope to hear from you soon !</div>
    </div>
  );
};
