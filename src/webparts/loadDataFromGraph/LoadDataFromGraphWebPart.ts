import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-property-pane";
import { MSGraphClient } from "@microsoft/sp-http";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

import * as strings from "LoadDataFromGraphWebPartStrings";
import LoadDataFromGraph from "./components/LoadDataFromGraph";
import { ILoadDataFromGraphProps } from "./components/ILoadDataFromGraphProps";
import Calendar from "./ICalendar";

import EventObserver from "./Observer";

export interface ILoadDataFromGraphWebPartProps {
  user: string;
  email: string;
  calendars: Calendar[];
}

export default class LoadDataFromGraphWebPart extends BaseClientSideWebPart<
  ILoadDataFromGraphWebPartProps
> {
  public client: MSGraphClient;

  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      this.loadMe()
        .then(() => this.loadCalendars())
        .then(() => this.render());
      if (!window["observer"]) window["observer"] = new EventObserver();
    });
  }

  public render(): void {
    const element: React.ReactElement<
      ILoadDataFromGraphProps
    > = React.createElement(LoadDataFromGraph, {
      user: this.properties.user,
      email: this.properties.email,
      calendars: this.properties.calendars || [],
      onChange: this.onChange
    });

    ReactDom.render(element, this.domElement);
  }

  public onChange = (ID: string) => {
    window["observer"].broadcast(ID);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  private async loadMe() {
    this.context.msGraphClientFactory.getClient().then(
      (client: MSGraphClient): void => {
        client
          .api("/me")
          .get((error, user: MicrosoftGraph.User, rawResponse?: any) => {
            if (user) {
              this.properties.user = user.displayName;
              this.properties.email = user.mail;
            }
            if (error) console.error(error);
          });
      }
    );
  }

  private async loadCalendars() {
    this.context.msGraphClientFactory.getClient().then(
      (client: MSGraphClient): void => {
        client
          .api("/me/calendars")
          .get((error, response, rawResponse?: any) => {
            if (response) {
              this.properties.calendars = response.value.map(calendar => {
                return {
                  id: calendar.id,
                  name: calendar.name
                };
              });
            }
            if (error) console.error(error);
          });
      }
    );
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
