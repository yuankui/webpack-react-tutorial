import * as React from "react";
import {ChangeEventHandler} from "react";

interface Props {
  label: string,
  text: string,
  type: string,
  id: string,
  value: string,
  handleChange: ChangeEventHandler<HTMLInputElement>,
}

export default class Input extends React.Component<Props, any> {
  render() {
    const {label, text, type, id, value, handleChange} = this.props;
    return <div className="form-group">
      <label htmlFor={label}>{text}</label>
      <input
        type={type}
        className="form-control"
        id={id}
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  }
}
