import * as React from "react";
import {
    EditorBlock,
    ContentBlock,
    EditorState,
    ContentState,
} from "draft-js";
import {GetState, StateChange} from "../../Editor";

export interface TodoProps {
    block: ContentBlock,
    blockProps: TodoBlockProps,
}

export interface TodoBlockProps {
    getState: GetState,
    onChange: StateChange,
}

export class TodoBlock extends React.Component<TodoProps, any> {

    constructor(props: Readonly<TodoProps>) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    updateData() {
        const {block, blockProps} = this.props;

        // This is the reason we needed a higher-order function for blockRendererFn
        const {getState, onChange} = blockProps;
        const data = block.getData();
        const checked = (data.has('checked') && data.get('checked') === true);
        const newData = data.set('checked', !checked);
        onChange(this.updateDataOfBlock(getState(), block, newData));
        return true;
    }

    updateDataOfBlock = (editorState: EditorState, block: ContentBlock, newData: any) => {
        const contentState = editorState.getCurrentContent();
        const newBlock: ContentBlock = block.merge({
            data: newData,
        }) as ContentBlock;
        const newContentState: ContentState = contentState.merge({
            blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
        }) as ContentState;
        return EditorState.push(editorState, newContentState, 'change-block-type');
    };

    render() {
        const data = this.props.block.getData();
        const checked = data.get('checked') === true;
        return (
            <div className={checked ? 'block-todo-completed block-todo' : 'block-todo'}>
                <input type="checkbox" checked={checked} onChange={this.updateData}/>
                <EditorBlock {...this.props} />
            </div>
        );
    }
}