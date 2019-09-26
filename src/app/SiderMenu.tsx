import React from "react";
import {Button, Icon, Input, Tree} from "antd";
import {connect} from "react-redux";
import {AppStore} from "../redux/store";
import {Dispatch} from "redux";
import {CreateNewPostCommand} from "../redux/commands/CreateNewPostCommand";
import {Post} from "../backend";
import {PostSelectCommand} from "../redux/commands/PostSelectCommand";
import {AntTreeNodeDropEvent} from "antd/es/tree/Tree";
import {MovePostCommand} from "../redux/commands/MovePostCommand";

const {TreeNode} = Tree;

export interface Node {
    key: string,
    title: string,
    children: Array<Node>,
    saved: boolean,
}

interface Props {
    list: Array<Node>,
    dispatch: Dispatch<any>,
    state: AppStore,
    selectedKeys: Array<string>,
}

interface State {
    expandedKeys: Array<string>,
}

class SiderMenu extends React.Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            expandedKeys: [],
        }
    }

    onExpand = (expandedKeys: Array<string>) => {
        this.setState({
            expandedKeys
        })
    };

    render() {
        return <React.Fragment>
            <div className='search-bar'>
                <Input className='input' placeholder="search"/>
                <span className='icon'>
                    <Button onClick={this.createNewPost}><Icon type="edit"/></Button>
                </span>
            </div>
            <Tree
                onDrop={options => this.onDrop(options)}
                selectedKeys={this.props.selectedKeys}
                expandedKeys={this.state.expandedKeys}
                onExpand={this.onExpand}
                multiple={false}
                draggable={true}
                onSelect={this.onSelect}
            >
                {this.renderTreeNodes(this.props.list)}
            </Tree>

        </React.Fragment>
    }

    onSelect = (keys: Array<string>) => {
        if (keys.length === 0)
            return;
        this.props.dispatch(new PostSelectCommand(keys[0]))
    };
    renderTreeNodes(data: Array<Node>) {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={this.renderTitle(item)} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} />;
        });
    }

    renderTitle(item: Node) {
        return <span onDoubleClick={(e) => this.doubleClick(item, e)} className={"menu-item"}>
            <Button onClick={e => {
                this.props.dispatch(new CreateNewPostCommand(item.key));
                e.stopPropagation();
            }} className='plus-icon'><Icon type="plus"/></Button>
            <span>{item.title + (item.saved? "": " *")}</span>
        </span>
    }

    doubleClick = (item: Node, e: React.MouseEvent<HTMLSpanElement>) => {
        let keys = this.state.expandedKeys.filter(key => key !== item.key);
        if (keys.length === this.state.expandedKeys.length) {
            this.onExpand([...this.state.expandedKeys, item.key]);
        } else {
            this.onExpand(keys);
        }
        e.stopPropagation();
    };

    createNewPost = () => {
        this.props.dispatch(new CreateNewPostCommand(null));
    };

    private onDrop(options: AntTreeNodeDropEvent) {
        console.log(options);
        if (options.dropToGap) {
            return;
        }

        const dragKey = options.dragNode.props.eventKey;
        const targetKey = options.node.props.eventKey;
        if (dragKey === undefined || targetKey === undefined) {
            return;
        }
        this.props.dispatch(new MovePostCommand(dragKey, targetKey));
    }
}


function mapStateToList(state: AppStore): Array<Node> {
    let a: Array<Node> = [];

    state.posts.forEach(p => {
        if (p == null) {
            return;
        }

        if (p.parentId != null) {
            return;
        }

        a.push({
            title: p.title,
            key: p.id,
            children: expandChild(p.id, state),
            saved: p.saved,
        })
    });

    return a;
}

function expandChild(id: string, state: AppStore): Array<Node> {
    const post: Post | undefined = state.posts.get(id);
    if (post == null) {
        return [];
    }
    return post.children.map(id => {
        let child = state.posts.get(id);
        if (child == null) {
            return null;
        }
        return {
            key: id,
            title: child.title,
            children: expandChild(id, state),
            saved: child.saved,
        }
    })
        .filter(o => o != null) as Array<Node>;
}

function traceRoot(id: string, state: AppStore): Array<string> {
    let a = [id];
    let post = state.posts.get(id);

    while (post != null && post.parentId != null) {
        a.push(post.parentId);
        post = state.posts.get(post.parentId);
    }
    return a;
}
function mapState(state: AppStore) {
    return {
        state,
        list: mapStateToList(state),
        selectedKeys: [state.currentPost.id],
        expandedKeys: traceRoot(state.currentPost.id, state),
    }
}

export default connect(mapState)(SiderMenu);