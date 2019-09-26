import * as React from "react";
import {ReactElement} from "react";
import {ContentBlock, ContentState, EditorState} from "draft-js";
import {EditController, StateChange} from "../../Editor";
import {Input} from "antd";
import {Controlled as CodeMirror} from 'react-codemirror2'
import * as codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

export interface CodeProps {
    block: ContentBlock,
    blockProps: CodeBlockProps,
}

export interface CodeBlockProps {
    state: EditorState,
    onChange: StateChange,
    editorController: EditController,
}

/**
 * TODO: support scale
 * TODO: support caption
 * TODO: save image as a file: to save space in .git
 *
 * there is still some bugs.
 */
export class CodeBlock extends React.Component<CodeProps, any> {
    private readonly content: ReactElement;

    constructor(props: Readonly<CodeProps>) {
        super(props);
        this.content = <Input
            onKeyPress={e => e.stopPropagation()}
            onKeyUp={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}/>;
    }

    onChange = (editor: codemirror.Editor, data: codemirror.EditorChange, value: string) => {

        const state = this.props.blockProps.state;

        const blockKey = state.getSelection().getStartKey();
        const currentBlock = state.getCurrentContent().getBlockForKey(blockKey);
        const newBlock = currentBlock.set("text", value) as ContentBlock;

        let blockMap = state.getCurrentContent().getBlockMap()
            .set(blockKey, newBlock);

        let newContent = state.getCurrentContent().set('blockMap', blockMap) as ContentState;

        const newState = EditorState.push(this.props.blockProps.state, newContent, 'change-block-data');

        console.log('newcode', value);
        this.props.blockProps.onChange(newState);
    };

    render() {
        const {block} = this.props;

        let code = block.getText();
        console.log('show code', code);
        return <div onKeyPress={(e) => {
            console.log('log key:', e.key);
            e.stopPropagation();
        }}>
            <CodeMirror value={code}
                        options={{
                            mode: 'javascript',
                            theme: 'material',
                            lineNumbers: true
                        }}
                        // 防止写入不进去。。 draft的bug
                        onFocus={() => this.props.blockProps.editorController.setEditable(false)}
                        onBlur={() => this.props.blockProps.editorController.setEditable(true)}
                        onBeforeChange={this.onChange}
            />
        </div>
    }
}