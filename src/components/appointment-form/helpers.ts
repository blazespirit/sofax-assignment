import { format } from "date-fns";

import { Option } from "../inputs/time-picker";

const defaultTimeOptions: Option<number>[] = [
  {
    id: "9",
    label: "9am - 10am",
    value: 9,
    taken: false,
  },
  {
    id: "10",
    label: "10am - 11am",
    value: 10,
    taken: false,
  },
  {
    id: "11",
    label: "11am - 12pm",
    value: 11,
    taken: false,
  },
  {
    id: "12",
    label: "12pm - 1pm",
    value: 12,
    taken: false,
  },
  {
    id: "13",
    label: "1pm - 2pm",
    value: 13,
    taken: false,
  },
  {
    id: "14",
    label: "2pm - 3pm",
    value: 14,
    taken: false,
  },
  {
    id: "15",
    label: "3pm - 4pm",
    value: 15,
    taken: false,
  },
  {
    id: "16",
    label: "4pm - 5pm",
    value: 16,
    taken: false,
  },
  {
    id: "17",
    label: "5pm - 6pm",
    value: 17,
    taken: false,
  },
];

export const getDefaultTimeOptions = () => [...defaultTimeOptions];

// convert JavaScript date object to date string (eg. '20201205')
export const convertJsDateToDateString = (date: Date) => {
  return format(date, "yyyyMMdd");
};
