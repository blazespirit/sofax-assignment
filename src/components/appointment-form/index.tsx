import { FC } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "../inputs/date-picker";
import { Option, TimePicker } from "../inputs/time-picker";
import styles from "./style.module.scss";
import { Button } from "../button";

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
    date: Yup.number().required(),
    time: Yup.number().required(),
  });

  // hard coded date options
  const dateOptions: Option<number>[] = [
    {
      id: "9",
      label: "9-10",
      value: 9,
    },
  ];

  return (
    <div className={styles.appointmentForm}>
      <Formik
        initialValues={appointmentDefaultFormValues}
        validationSchema={formValidation}
        onSubmit={() => {}}
      >
        <Form>
          <div className={styles.form}>
            <div className={styles.input}>
              <DatePicker name="date" placeholder="Appointment Date" />
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
