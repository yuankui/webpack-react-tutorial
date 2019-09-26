import React, {Component, KeyboardEvent} from 'react';
import {convertFromRaw, Editor, EditorState, RawDraftContentState} from 'draft-js';
import {EditorPlugin, mergePlugins} from "./plugins";
import {Backend} from "../backend";
import {createToggleHeaderPlugin} from "./plugins/toggle-header-plugin";
import {createToggleListPlugin} from "./plugins/toggle-prefix-plugin";
import {createResetBlockAfterEnter} from "./plugins/common-plugin/reset-block-after-enter";
import {createInlineHotkey} from "./plugins/common-plugin/inline-hot-key-plugin";
import {createCodePlugin} from "./plugins/code-plugin";
import {createTodoPlugin} from "./plugins/todo-plugin";
import {createImagePlugin} from "./plugins/image-plugin";
import {createSoftInsertPlugin} from "./plugins/common-plugin/soft-insert-plugin";
import './editor.css';

export interface StateChange {
    (value: EditorState): void,
}

export interface GetState {
    (): EditorState;
}

export interface EditController {
    setEditable(editable: boolean): void;
}

interface Props {
    content: RawDraftContentState,
    onChange: StateChange,
    editable: boolean,
    backend: Backend;
}

interface State {
    editorState: EditorState,
    saved: boolean,
}

export class MyEditor extends Component<Props, State> {
    private readonly ref: React.RefObject<Editor>;

    constructor(props: Readonly<Props>) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            editorState: EditorState.createWithContent(
                convertFromRaw(this.props.content)
            ),
            saved: true,
        };
    }

    save = () => {
        if (!this.state.saved) {
            this.props.onChange(this.state.editorState);
            this.setState({
                saved: true,
            })
        }
    };

    componentDidMount(): void {
        this.focus();
    }

    focus() {
        if (this.ref.current != null) {
            this.ref.current.focus();
        }
    }

    onChange = (state: EditorState) => {
        this.setState({
            editorState: state,
            saved: false,
        })
    };

    render() {
        const editorState = this.state.editorState;
        const plugins: Array<EditorPlugin> = [
            createToggleHeaderPlugin(this.onChange),
            createToggleListPlugin(editorState, this.onChange),
            createResetBlockAfterEnter(this.onChange),
            createInlineHotkey(editorState, this.onChange),
            createCodePlugin(editorState, this.onChange),
            createTodoPlugin(() => editorState, this.onChange),
            createImagePlugin(editorState, this.onChange),
            createSoftInsertPlugin(editorState, this.onChange),
        ];

        const plugin = mergePlugins(plugins);

        const wordCount = this.state.editorState.getCurrentContent()
            .getBlockMap()
            .valueSeq()
            .map<number>(value => {
                if (value != null) {
                    return value.getLength();
                }
                return 0;
            })
            .reduce((reduction, value) => (reduction as number) + (value as number), 0);

        return (
            <div onBlur={this.save} onKeyDown={this.onEsc} className='editor' onClick={() => this.focus()}>
                <Editor
                    placeholder={"Start here..."}
                    editorState={this.state.editorState}
                    readOnly={!this.props.editable}
                    ref={this.ref}
                    onChange={this.onChange}
                    {...plugin}
                />
                <div className={"post-bottom-bar"}>
                    word count: {wordCount}
                </div>
            </div>
        );
    }

    onEsc = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            if (this.ref.current != null) {
                this.ref.current.blur();
            }
        }
    }
}