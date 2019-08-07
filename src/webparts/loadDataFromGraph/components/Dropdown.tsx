import * as React from "react";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownOption
} from "office-ui-fabric-react/lib/Dropdown";

import * as strings from "LoadDataFromGraphWebPartStrings";
import Calendar from "../ICalendar";

import EventObserver from "../Observer";

interface IDropdownControlledProps {
  options: Calendar[];
  onChange: Function;
}

interface IDropdownControlledState {
  selectedItem?: { key: string | number | undefined };
}

export default class DropdownControlled extends React.Component<
  IDropdownControlledProps,
  IDropdownControlledState
> {
  public state: IDropdownControlledState = {
    selectedItem: undefined
  };

  public render() {
    const { selectedItem } = this.state;

    return (
      <Dropdown
        label={strings.CalendarsDropdownLabel}
        selectedKey={selectedItem ? selectedItem.key : undefined}
        onChange={this._onChange}
        placeholder={strings.SelectCalendar}
        options={this.props.options.map(option => {
          return {
            key: option.id,
            text: option.name
          };
        })}
        styles={{ dropdown: { width: 300 } }}
      />
    );
  }

  private _onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    this.props.onChange(item.key);
  }
}
