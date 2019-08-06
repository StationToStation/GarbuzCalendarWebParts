import * as React from "react";
import Event from "../IEvent";
import { escape } from "@microsoft/sp-lodash-subset";
import styles from "./EventItem.module.scss";

export default class EventItem extends React.Component<Event, {}> {
  private start: Date;
  private months = []

  public constructor(props: Event) {
    super(props);
    console.log(props);
    this.start = new Date(this.props.start);
  }

  public render() {
    return (
      <div className={styles.eventItem}>
        <div className={styles.container}>
          <div>
            <p>{this.start.getUTCDate()}</p>
            <p>{this.start.getUTCMonth()}</p>
          </div>
          <div>
            <p>
              {this.start.getUTCHours()}:{this.start.getUTCMinutes()}
            </p>
            <h3 className={styles.title}>{this.props.title}</h3>
            <p>{this.props.location}</p>
          </div>
        </div>
      </div>
    );
  }
}
