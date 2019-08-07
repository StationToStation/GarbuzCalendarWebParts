import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from "@microsoft/sp-property-pane";
import { MSGraphClient } from "@microsoft/sp-http";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

import * as strings from "CalendarDataWebPartStrings";
import CalendarData from "./components/CalendarData";
import { ICalendarDataProps } from "./components/ICalendarDataProps";
import Event from "./components/IEvent";

import EventObserver from "../loadDataFromGraph/Observer";

export interface ICalendarDataWebPartProps {
  calendarID: string;
  connected: boolean;
  calendarName: string;
  events: Event[];
}

export default class CalendarDataWebPart extends BaseClientSideWebPart<
  ICalendarDataWebPartProps
> {
  public top = 3;
  public onInit(): Promise<void> {
    return super.onInit().then(() => {
      this.loadEvents()
        .then(() => {
          this.loadCalendarName();
        })
        .then(this.render);
      if (this.properties.connected) {
        if (!window["observer"]) window["observer"] = new EventObserver();
        window["observer"].subscribe(this.connect);
      }
    });
  }

  public render(): void {
    const element: React.ReactElement<ICalendarDataProps> = React.createElement(
      CalendarData,
      {
        calendarName: this.properties.calendarName,
        events: this.properties.events || []
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  private async loadCalendarName() {
    this.context.msGraphClientFactory.getClient().then(
      (client: MSGraphClient): void => {
        client
          .api(
            `https://graph.microsoft.com/v1.0/me/calendars/${
              this.properties.calendarID
            }`
          )
          .get(
            (error, calendar: MicrosoftGraph.Calendar, rawResponse?: any) => {
              if (calendar) {
                this.properties.calendarName = calendar.name;
              }
              if (error) console.error(error);
            }
          );
      }
    );
  }

  private async loadEvents() {
    this.context.msGraphClientFactory.getClient().then(
      (client: MSGraphClient): void => {
        client
          .api(
            `https://graph.microsoft.com/v1.0/me/calendars/${
              this.properties.calendarID
            }/events?top=${this.top}`
          )
          .get((error, events, rawResponse?: any) => {
            if (events) {
              this.properties.events = events.value.map(
                (event: MicrosoftGraph.Event) => {
                  return {
                    id: event.id,
                    title: event.subject,
                    start: event.start.dateTime,
                    end: event.end.dateTime,
                    location: event.location.displayName
                  };
                }
              );
            }
            if (error) console.error(error);
          });
      }
    );
  }

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue,
    newValue
  ) {
    if (propertyPath === "connected") {
      if (!window["observer"]) window["observer"] = new EventObserver();
      if (newValue) window["observer"].subscribe(this.connect);
      else window["observer"].unsubscribe(this.connect);
    }
  }

  public connect = async data => {
    this.properties.calendarID = data;
    this.loadEvents()
      .then(() => {
        this.loadCalendarName();
      })
      .then(() =>
        //да, это плохо, я знаю, поправлю, если нужно
        setTimeout(() => {
          this.render();
        }, 1000)
      );
  };

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneToggle("connected", {
                  label: strings.ToggleSourceLabel
                }),
                PropertyPaneTextField("calendarID", {
                  label: strings.CalendarIDLabel,
                  disabled: this.properties.connected
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
