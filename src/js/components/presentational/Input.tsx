import * as React from "react";
import {ChangeEventHandler} from "react";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

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

      <CodeMirror
        value='<h1>I ♥ react-codemirror2</h1>'
        options={{
          mode: 'xml',
          theme: 'material',
          lineNumbers: true
        }}
        onChange={(editor, data, value) => {
        }}
      />
    </div>
  }
}
