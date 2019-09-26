import {connect} from "react-redux";
import {AppStore} from "./redux/store";
import React from "react";

function mapState(state: AppStore): Props {
    return {
        age: 3
    };
}

interface Props {
    age: number,
}

class Com extends React.Component<Props, any> {
    render(): any{
        return <div>hello</div>
    }
}
let Editor = connect(mapState)(Com);
function Hello() {
    return <Editor />
}