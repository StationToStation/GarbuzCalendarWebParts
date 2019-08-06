import * as React from "react";
import Event from "../IEvent";
import { escape } from "@microsoft/sp-lodash-subset";
import styles from "./EventItem.module.scss";
import * as strings from "CalendarDataWebPartStrings";

export default class EventItem extends React.Component<Event, {}> {
  private start: Date;
  private months = [
    strings.January,
    strings.February,
    strings.March,
    strings.April,
    strings.May,
    strings.June,
    strings.July,
    strings.August,
    strings.September,
    strings.October,
    strings.November,
    strings.December
  ];

  private time: string;

  public constructor(props: Event) {
    super(props);
    console.log(props);
    this.start = new Date(this.props.start);
    let hours = this.start.getHours();
    console.log(hours-12);
    switch (hours) {
      case 0:
        this.time = "12";
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        this.time = hours + "";
        break;
      default:
        this.time = hours - 12 + "";
    }
    this.time =
      this.start.getHours() === 0
        ? "12"
        : this.start.getHours().toString();
    this.time += ":";
    this.time +=
      this.start.getMinutes() === 0
        ? "00"
        : this.start.getMinutes().toString();
    if (this.start.getHours() < 12) this.time += " AM";
    else this.time += " PM";
  }

  public render() {
    return (
      <div className={styles.eventItem}>
        <div className={styles.container}>
          <div className={styles.row}>
            <p className={styles.day}>{this.start.getDate()}</p>
            <p className={styles.month}>{this.months[this.start.getMonth()].toUpperCase()}</p>
          </div>
          <div className={styles.row}>
            <p className={styles.time}>{this.time}</p>
            <h3 className={styles.title}>{this.props.title}</h3>
            <p className={styles.location}>{this.props.location}</p>
          </div>
        </div>
      </div>
    );
  }
}
