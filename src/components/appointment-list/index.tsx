import { FC, useCallback, useMemo } from "react";
import { AppointmentDocWithId } from "../../App";
import {
  convertFirestoreTimestampToDateString,
  convertFirestoreTimestampToTimeString,
  deleteAppointmentById,
} from "../../firestore";
import { Button } from "../button";
import styles from "./style.module.scss";

type Props = {
  appointments: AppointmentDocWithId[];
};

type Booking = {
  id: string;
  formattedDate: string;
  formattedTime: string;
};

export const AppointmentList: FC<Props> = (props) => {
  const { appointments } = props;

  const appointmentWithFormattedLabel = useMemo<Booking[]>(() => {
    return appointments.map((booking) => ({
      id: booking.id,
      formattedDate: convertFirestoreTimestampToDateString(
        booking.appointmentDate
      ),
      formattedTime: convertFirestoreTimestampToTimeString(
        booking.appointmentDate
      ),
    }));
  }, [appointments]);

  const cancelAppointment = useCallback(
    (booking: Booking) => () => {
      if (
        window.confirm(
          `Do you want to cancel appointment on ${booking.formattedDate} @ ${booking.formattedTime}`
        )
      ) {
        deleteAppointmentById(booking.id);
      }
    },
    []
  );

  return (
    <div className={styles.card}>
      <div className={styles.title}>Your appointment(s) with SofaX</div>
      {appointmentWithFormattedLabel.map((booking) => (
        <div className={styles.row} key={booking.id}>
          <div className={styles.appointment}>
            <div>{booking.formattedDate}</div>
            <div>&nbsp;{`@ ${booking.formattedTime}`}</div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button
              variant="outlined"
              size="small"
              onClick={cancelAppointment(booking)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
