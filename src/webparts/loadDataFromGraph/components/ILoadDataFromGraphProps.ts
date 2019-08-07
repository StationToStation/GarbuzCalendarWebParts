import Calendar from "../ICalendar";

export interface ILoadDataFromGraphProps {
  user: string;
  email: string;
  calendars: Calendar[];
  onChange: Function;
}
