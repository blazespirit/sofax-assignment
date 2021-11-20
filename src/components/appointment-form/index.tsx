import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { addDays, addWeeks, getHours, isWeekend, set } from "date-fns";
import { onSnapshot } from "firebase/firestore";
import { Form, Formik, FormikHelpers } from "formik";
import { groupBy } from "lodash-es";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

import {
  AppointmentDoc,
  convertFirestoreTimestampToDateString,
  createAppointment,
  getAppointmentsQueryForDateRange,
} from "../../firestore";
import { Button } from "../button";
import { DatePicker } from "../inputs/date-picker";
import { TimePicker } from "../inputs/time-picker";
import { convertJsDateToDateString, getDefaultTimeOptions } from "./helpers";
import styles from "./style.module.scss";

type FormValues = {
  date: number | string;
  time: number | string;
};

type Props = {
  username: string;
};

export const AppointmentForm: FC<Props> = (props) => {
  const { username } = props;
  const [appointmentsGroupedByDate, setAppointmentsGroupedByDate] = useState<{
    [key: string]: AppointmentDoc[];
  }>({});
  const [selectedDate, setSelectedDate] = useState<number | undefined>();

  const appointmentDefaultFormValues: FormValues = {
    date: "",
    time: "",
  };

  const formValidation: Yup.SchemaOf<FormValues> = Yup.object({
    date: Yup.number().required("Please select a date."),
    time: Yup.number().required("Please select a desire time."),
  });

  // TODO -- check if the next 2 days fall on weekend as well
  const earliestPossibleApppointmentDate = useMemo(() => {
    const twoDaysAfter = addDays(new Date(), 2);
    const startAt9am = set(twoDaysAfter, {
      hours: 9,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    return startAt9am;
  }, []);

  const nextThreeWeeks = useMemo(() => {
    const threeWeeksAfter = addWeeks(new Date(), 3);
    const endAt5pm = set(threeWeeksAfter, {
      hours: 17,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    return endAt5pm;
  }, []);

  const disableWeekend = useCallback((date: MaterialUiPickersDate) => {
    if (!date) return true;
    return isWeekend(date);
  }, []);

  // get all the appointments in Firestore and update the available time slot.
  // we can improve this section to reduce unnecessary re-render, but I think
  // this is good enough for now.
  useEffect(() => {
    const appointmentsQuery = getAppointmentsQueryForDateRange(
      earliestPossibleApppointmentDate,
      nextThreeWeeks
    );

    onSnapshot(appointmentsQuery, (querySnapshot) => {
      const allAppointmentsWithinSelectableRange: AppointmentDoc[] = [];

      querySnapshot.forEach((doc) => {
        allAppointmentsWithinSelectableRange.push(doc.data() as AppointmentDoc);

        // group all the appointments by date
        const appointmentsGroupedByDate = groupBy(
          allAppointmentsWithinSelectableRange,
          (appointmentRecord) => {
            return convertFirestoreTimestampToDateString(
              appointmentRecord.appointmentDate
            );
          }
        );

        setAppointmentsGroupedByDate(appointmentsGroupedByDate);
      });
    });
  }, [earliestPossibleApppointmentDate, nextThreeWeeks]);

  // time dropdown option with 'taken' field update using the appointment records from Firestore
  const timeOptions = useMemo(() => {
    const defaultOptions = getDefaultTimeOptions();

    if (!selectedDate) return defaultOptions;

    const selectedDateString = convertJsDateToDateString(
      new Date(selectedDate)
    );

    const appointmentsOnSelectedDate =
      appointmentsGroupedByDate[selectedDateString];

    if (!appointmentsOnSelectedDate) return defaultOptions;

    const defaultOptionsWithUpdatedTakenField = defaultOptions.map(
      (timeSlot) => {
        let taken = false;
        // loop thru each appointments to see if it's taken
        appointmentsOnSelectedDate.forEach((appointment) => {
          const appointmentDate = appointment.appointmentDate.toDate();
          if (getHours(appointmentDate) === timeSlot.value) {
            taken = true;
          }
        });
        return {
          ...timeSlot,
          label: taken ? `${timeSlot.label} (taken)` : timeSlot.label,
          taken,
        };
      }
    );
    return defaultOptionsWithUpdatedTakenField;
  }, [selectedDate, appointmentsGroupedByDate]);

  const handleDateChange = useCallback(
    (setFieldValue) => (date: number) => {
      setSelectedDate(date);
      setFieldValue("time", "");
    },
    [setSelectedDate]
  );

  const makeAppointment = useCallback(
    async (formValues: FormValues, formikHelper: FormikHelpers<FormValues>) => {
      // Formik will validate the form before submit,
      // we shouldn't hit the below checking,
      // but just in case.
      if (!formValues.date || !formValues.time) {
        throw new Error("Form fields not completed!");
      }

      const selectedDate = new Date(formValues.date);

      // set the hour to selected time
      const adjustedDate = set(selectedDate, {
        hours: formValues.time as number,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });

      formikHelper.setSubmitting(true);

      await createAppointment(adjustedDate, username);

      formikHelper.setSubmitting(false);
      formikHelper.resetForm();

      alert("Your appointment had been confirmed, see you soon!");
    },
    [username]
  );

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
        onSubmit={makeAppointment}
      >
        {({ setFieldValue }) => (
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
                  onChange={handleDateChange(setFieldValue)}
                />
              </div>
              <div className={styles.input}>
                <TimePicker
                  name="time"
                  placeholder="Appointment Time"
                  options={timeOptions}
                />
              </div>
            </div>
            <div className={styles.submitButtonWrapper}>
              <div className={styles.submitButton}>
                <Button>Book</Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
