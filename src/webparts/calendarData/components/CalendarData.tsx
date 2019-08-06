import * as React from "react";
import styles from "./CalendarData.module.scss";
import { ICalendarDataProps } from "./ICalendarDataProps";
import EventItem from "./Event/EventItem";
import Event from "./IEvent";

export default class CalendarData extends React.Component<
  ICalendarDataProps,
  {}
> {
  public constructor(props: ICalendarDataProps) {
    super(props);
  }

  public render(): React.ReactElement<ICalendarDataProps> {
    return (
      <div className={styles.calendarData}>
        <div className={styles.container}>
          <span className={styles.title}>{this.props.calendarName}</span>
          <div className={styles.eventsContainer}>
            {this.props.events.map((event: Event) => {
              return <EventItem {...event} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}
