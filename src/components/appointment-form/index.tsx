import { FC } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "../date-picker";
import { Option, TimePicker } from "../time-picker";

type FormValues = {
  date: number;
  time: number;
};

export const AppointmentForm: FC = () => {
  console.log("appointment form");

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
    <div>
      <Formik
        initialValues={appointmentDefaultFormValues}
        validationSchema={formValidation}
        onSubmit={() => {}}
      >
        <Form>
          <DatePicker name="date" placeholder="Appointment Date" />
          <TimePicker
            name="time"
            placeholder="Appointment Time"
            options={dateOptions}
          />
        </Form>
      </Formik>
    </div>
  );
};
