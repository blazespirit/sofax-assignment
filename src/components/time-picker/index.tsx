import clsx from "clsx";
import { ErrorMessage, useField } from "formik";
import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import ClickAwayListener from "react-click-away-listener";
import styles from "../dropdown-picker-shared-style.module.scss";
import expandLessIcon from "./expand_less_24px.svg";
import expandMoreIcon from "./expand_more_24px.svg";

type Props<T> = {
  name: string;
  placeholder: string;
  options: Option<T>[];
  onChange?: (newValue: T) => void;
  disabled?: boolean;
};

export type Option<T> = {
  id: string;
  label: string;
  value: T;
};

export function TimePicker<T>(props: PropsWithChildren<Props<T>>) {
  const { name, placeholder, options, onChange, disabled } = props;
  const [field, meta, helpers] = useField(name);
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const toggleList = useCallback(() => {
    if (disabled) return;

    setIsListOpen(!isListOpen);

    if (nodeRef.current) {
      isListOpen ? nodeRef.current.blur() : nodeRef.current.focus();
    }
  }, [disabled, setIsListOpen, isListOpen, nodeRef]);

  const closeList = useCallback(() => {
    setIsListOpen(false);

    if (nodeRef.current) {
      nodeRef.current.blur();
    }
  }, [setIsListOpen, nodeRef]);

  const setValue = useCallback(
    (newValue) => () => {
      helpers.setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [helpers, onChange]
  );

  const isError = useMemo<boolean>(
    () => meta.touched && meta.error !== undefined,
    [meta.touched, meta.error]
  );

  const getOptionLabelByValue = (value: T) =>
    options.length === 0
      ? ""
      : options.find((opt) => opt.value === value)!.label;

  const renderValidationErrorMsg = useCallback(
    (errMsg) => <div className={styles.validationErrorMsg}>{errMsg}</div>,
    []
  );

  return (
    <ClickAwayListener onClickAway={closeList}>
      <div>
        <div
          className={clsx(styles.container, {
            [styles.error]: isError,
            [styles.disabled]: disabled,
          })}
          onClick={toggleList}
          ref={nodeRef}
          tabIndex={-1} // `tabIndex` is needed in order for <div> to be focusable
        >
          <div
            className={clsx(styles.placeholder, {
              [styles.error]: isError,
              [styles.label]: field.value !== "",
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
              {getOptionLabelByValue(field.value)}
            </div>
          )}
          <img
            src={isListOpen ? expandLessIcon : expandMoreIcon}
            className={styles.icon}
            alt="expand-close-icon"
          />
          {isListOpen && (
            <div className={styles.dropdown}>
              {options.map((opts) => (
                <div
                  className={styles.option}
                  onClick={setValue(opts.value)}
                  key={opts.id}
                >
                  {opts.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <ErrorMessage name={field.name}>
          {renderValidationErrorMsg}
        </ErrorMessage>
      </div>
    </ClickAwayListener>
  );
}
