import { FC, useCallback, useMemo } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "../inputs/date-picker";
import { Option, TimePicker } from "../inputs/time-picker";
import styles from "./style.module.scss";
import { Button } from "../button";
import { addDays, addWeeks, isWeekend } from "date-fns";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

type FormValues = {
  date: number;
  time: number;
};

export const AppointmentForm: FC = () => {
  const appointmentDefaultFormValues = {
    date: "",
    time: "",
  };

  const formValidation: Yup.SchemaOf<FormValues> = Yup.object({
    date: Yup.number().required("Please select a date."),
    time: Yup.number().required("Please select a desire time."),
  });

  // hard coded date options
  const dateOptions: Option<number>[] = [
    {
      id: "9",
      label: "9am - 10am",
      value: 9,
    },
    {
      id: "10",
      label: "10am - 11am",
      value: 10,
    },
    {
      id: "11",
      label: "11am - 12pm",
      value: 11,
    },
    {
      id: "12",
      label: "12pm - 1pm",
      value: 12,
    },
    {
      id: "13",
      label: "1pm - 2pm",
      value: 13,
    },
    {
      id: "14",
      label: "2pm - 3pm",
      value: 14,
    },
    {
      id: "15",
      label: "3pm - 4pm",
      value: 15,
    },
    {
      id: "16",
      label: "4pm - 5pm",
      value: 16,
    },
    {
      id: "17",
      label: "5pm - 6pm",
      value: 17,
    },
  ];

  // TODO -- check if the next 2 days fall on weekend as well
  const earliestPossibleApppointmentDate = useMemo(
    () => addDays(new Date(), 2),
    []
  );

  const nextThreeWeeks = useMemo(() => addWeeks(new Date(), 3), []);

  const disableWeekend = useCallback((date: MaterialUiPickersDate) => {
    if (!date) return true;
    return isWeekend(date);
  }, []);

  return (
    <div className={styles.appointmentForm}>
      <div className={styles.annotation}>
        <div>- Appointment must be made 2 days in advance.</div>
        <div>- Appointment made cannot be more than 3 weeks in advance.</div>
        <div>- Our operation hours is 9am to 6pm from Monday to Friday.</div>
        <div>- We are closed on Saturday and Sunday.</div>
      </div>
      <Formik
        initialValues={appointmentDefaultFormValues}
        validationSchema={formValidation}
        onSubmit={() => {}}
      >
        <Form>
          <div className={styles.form}>
            <div className={styles.input}>
              <DatePicker
                name="date"
                placeholder="Appointment Date"
                preselectDate={earliestPossibleApppointmentDate}
                minDate={earliestPossibleApppointmentDate}
                minDateMessage="Appointment must be made 2 days in advance."
                maxDate={nextThreeWeeks}
                maxDateMessage="Appointment made cannot be more than 3 weeks in advance."
                shouldDisableDate={disableWeekend}
              />
            </div>
            <div className={styles.input}>
              <TimePicker
                name="time"
                placeholder="Appointment Time"
                options={dateOptions}
              />
            </div>
          </div>
          <div className={styles.submitButtonWrapper}>
            <div className={styles.submitButton}>
              <Button>Book</Button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
