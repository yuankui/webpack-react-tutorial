import * as React from "react";
import {ReactElement} from "react";
import {ContentBlock, EditorState, Modifier,} from "draft-js";
import {StateChange} from "../../Editor";
import {Input} from "antd";
import {ResizableBox, ResizeCallbackData} from 'react-resizable';
import 'react-resizable/css/styles.css';

export interface ImageProps {
    block: ContentBlock,
    blockProps: ImageBlockProps,
}

export interface ImageBlockProps {
    state: EditorState,
    onChange: StateChange,
}

/**
 * TODO: support scale
 * TODO: support caption
 * TODO: save image as a file: to save space in .git
 *
 * there is still some bugs.
 */
export class ImageBlock extends React.Component<ImageProps, any> {
    private readonly content: ReactElement;

    constructor(props: Readonly<ImageProps>) {
        super(props);
        this.content = <Input
            onKeyPress={e => e.stopPropagation()}
            onKeyUp={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}/>;
    }

    onResize = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
        const newData = this.props.block.getData().set('height', data.size.height)
            .set('width', data.size.width);

        const newContent = Modifier.setBlockData(this.props.blockProps.state.getCurrentContent(),
            this.props.blockProps.state.getSelection(),
            newData
        );

        const newState = EditorState.push(this.props.blockProps.state, newContent, 'change-block-data');

        this.props.blockProps.onChange(newState);
    };

    render() {
        const {block} = this.props;
        const data = block.getData();
        let url = data.get("url");
        let width = data.get('width');
        let height = data.get('height');
        return <ResizableBox className='align-left'
                             lockAspectRatio={true}
                             height={height}
                             onResize={this.onResize}
                             width={width}>
                <img width='100%' height='100%' alt="load failed" src={url}/>
            </ResizableBox>;
    }
}