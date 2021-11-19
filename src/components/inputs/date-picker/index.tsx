import DateFnsUtils from "@date-io/date-fns";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  DatePicker as MuiDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import clsx from "clsx";
import { format } from "date-fns";
import { ErrorMessage, useField } from "formik";
import {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "../dropdown-picker-shared-style.module.scss";
import calendarIcon from "./calendar_24px.svg";
import calendarDisabledIcon from "./calendar_disabled_24px.svg";

type Props = {
  name: string;
  placeholder: string;
  disablePastDate?: boolean;
  disableFutureDate?: boolean;
  disabled?: boolean;
  minDate?: Date;
  minDateMessage?: string;
  onChange?: (newDate: any) => void;
};

export const DatePicker: FC<Props> = (props) => {
  const {
    name,
    placeholder,
    disablePastDate,
    disableFutureDate,
    disabled,
    minDate,
    minDateMessage,
    onChange,
  } = props;
  const [field, meta, helpers] = useField(name);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const nodeRef = useRef<HTMLDivElement>(null);

  // set the formik date into date-picker on initial start up
  useEffect(() => {
    if (field.value) {
      setSelectedDate(new Date(field.value));
    }
  }, [field.value]);

  const toggleCalendar = useCallback(() => {
    if (disabled) return;

    setIsCalendarOpen(!isCalendarOpen);

    if (nodeRef.current) {
      isCalendarOpen ? nodeRef.current.blur() : nodeRef.current.focus();
    }
  }, [disabled, setIsCalendarOpen, isCalendarOpen, nodeRef]);

  const closeCalendar = useCallback(() => {
    setIsCalendarOpen(false);

    if (nodeRef.current) {
      nodeRef.current.blur();
    }
  }, [setIsCalendarOpen, nodeRef]);

  const onDateChange = useCallback(
    (newDate) => {
      const time = newDate.getTime();
      helpers.setValue(time);
      setSelectedDate(newDate);
      closeCalendar();

      if (onChange) {
        onChange(time);
      }
    },
    [helpers, setSelectedDate, closeCalendar, onChange]
  );

  const formattedDateStr = useMemo(() => {
    const time = field.value;
    if (!time) return "";
    const dateObj = new Date(time);
    return format(dateObj, "dd/MM/yyyy");
  }, [field.value]);

  const stopEventPropagation = useCallback((e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, []);

  const isError = useMemo<boolean>(
    () => meta.touched && meta.error !== undefined,
    [meta.touched, meta.error]
  );

  const renderValidationErrorMsg = useCallback(
    (errMsg) => <div className={styles.validationErrorMsg}>{errMsg}</div>,
    []
  );

  // theming the date-picker
  const { fontFamily } = styles;
  const customTheme = createTheme({
    overrides: {
      MuiTypography: {
        caption: {
          fontFamily,
        },
        body1: {
          fontFamily,
        },
        body2: {
          fontFamily,
        },
      },
    },
  });

  return (
    <>
      <div
        className={clsx(styles.container, {
          [styles.error]: isError,
          [styles.disabled]: disabled,
        })}
        onClick={toggleCalendar}
        ref={nodeRef}
        tabIndex={-1} // `tabIndex` is needed in order for <div> to be focusable
      >
        <div
          className={clsx(styles.placeholder, {
            [styles.error]: isError,
            [styles.label]: field.value !== "",
            [styles.disabled]: disabled,
          })}
        >
          {placeholder}
        </div>
        {field.value && (
          <div
            className={clsx(styles.value, {
              [styles.disabled]: disabled,
            })}
          >
            {formattedDateStr}
          </div>
        )}
        {disabled ? (
          <img
            src={calendarDisabledIcon}
            className={styles.icon}
            alt="disabled-calender-icon"
          />
        ) : (
          <img src={calendarIcon} className={styles.icon} alt="calender-icon" />
        )}
        {isCalendarOpen && (
          <div className={styles.calendar} onClick={stopEventPropagation}>
            <ThemeProvider theme={customTheme}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <MuiDatePicker
                  value={selectedDate}
                  onChange={onDateChange}
                  variant="static"
                  disableToolbar
                  disablePast={disablePastDate}
                  disableFuture={disableFutureDate}
                  disabled={disabled}
                  minDate={minDate}
                  minDateMessage={minDateMessage}
                />
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </div>
        )}
      </div>
      <ErrorMessage name={field.name}>{renderValidationErrorMsg}</ErrorMessage>
    </>
  );
};
