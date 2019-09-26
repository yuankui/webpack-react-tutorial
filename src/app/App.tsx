import React, {ChangeEvent, createRef, KeyboardEvent} from 'react';
import {MyEditor} from "../Editor/Editor";
import {convertToRaw, EditorState} from "draft-js";
import './App.css';
import {Button, Layout} from 'antd';
import SiderMenu, {Node} from './SiderMenu';
import './menu.css';
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {AppStore, EditingPost} from "../redux/store";
import {UpdateEditingPostCommand} from "../redux/commands/UpdateEditingPostCommand";
import {SyncPostCommand} from "../redux/commands/SyncPostCommand";
import {SavePostsCommand} from "../redux/commands/SavePostsCommand";

const {Sider, Content} = Layout;

interface AppState {
    editable: boolean,
}

interface AppProps {
    state: AppStore,
    editingPost: EditingPost,
    dispatch: Dispatch<any>,
    list: Array<Node>,
}

class App extends React.Component<AppProps, AppState> {
    private readonly editor: React.RefObject<MyEditor>;

    constructor(props: Readonly<any>) {
        super(props);
        this.editor = createRef();

        this.state = {
            editable: true,
        };
    }

    componentDidMount(): void {
        const that = this;
        document.addEventListener("keydown", function (event) {

            if ((event.ctrlKey || event.metaKey) && event.which === 83) {
                // Save Function
                that.props.dispatch(new SavePostsCommand());
                event.preventDefault();
                return false;
            }
        });
    }

    onChange = (v: EditorState) => {
        this.props.dispatch(new UpdateEditingPostCommand({
            ...this.props.editingPost,
            saved: false,
            content: convertToRaw(v.getCurrentContent()),
        }));
    };

    focus = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            const editor = this.editor.current;
            if (editor != null) {
                editor.focus();
            }
        }
    };


    render() {
        const editorState = this.props.editingPost.content;

        let key = this.props.state.currentPost.id;
        return (
            <Layout className='layout'>
                <Sider theme='light' width={300}>
                    <Button onClick={() => {

                    }}>测试</Button>
                    <SiderMenu/>
                </Sider>
                <Content
                    onBlur={() => {
                        this.props.dispatch(new SyncPostCommand());
                    }}
                    onKeyDown={e => e.stopPropagation()}>
                    <span>
                        <input className={'title'}
                               placeholder={"Untitled"}
                               value={this.props.editingPost.title}
                               onChange={this.onTitleChange}
                               onKeyPress={this.focus}/>
                    </span>
                    <MyEditor ref={this.editor}
                              key={key}
                              backend={this.props.state.backend}
                              editable={this.state.editable}
                              content={editorState}
                              onChange={this.onChange}/>
                </Content>
            </Layout>
        );
    }

    onTitleChange = (value: ChangeEvent<HTMLInputElement>) => {
        this.props.dispatch(
            new UpdateEditingPostCommand({
                ...this.props.editingPost,
                saved: false,
                title: value.target.value,
            })
        );
    };
}

function mapState(state: AppStore) {
    return {
        state,
        editingPost: state.currentPost,
    }
}

export default connect(mapState)(App);