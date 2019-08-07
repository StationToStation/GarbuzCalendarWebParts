import * as React from "react";
import styles from "./LoadDataFromGraph.module.scss";
import { ILoadDataFromGraphProps } from "./ILoadDataFromGraphProps";
import { escape } from "@microsoft/sp-lodash-subset";

import * as strings from "LoadDataFromGraphWebPartStrings";
import Dropdown from "./Dropdown";

export default class LoadDataFromGraph extends React.Component<
  ILoadDataFromGraphProps,
  {}
> {
  public componentDidUpdate(prevProps: ILoadDataFromGraphProps, prevState: {}) {
    for (var key in prevProps) {
      if (prevProps[key] !== this.props[key]) {
        this.forceUpdate();
        break;
      }
    }
  }

  public render(): React.ReactElement<ILoadDataFromGraphProps> {
    return (
      <div className={styles.loadDataFromGraph}>
        <div className={styles.container}>
          <span className={styles.title}>{escape(this.props.user)}</span>
          <p className={styles.email}>
            {strings.Email + escape(this.props.email)}
          </p>
          <Dropdown
            options={this.props.calendars}
            onChange={this.props.onChange}
          />
        </div>
      </div>
    );
  }
}
