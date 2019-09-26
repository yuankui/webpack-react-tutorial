import {GetState, StateChange} from "../../Editor";
import {ContentBlock, ContentState, DraftEditorCommand, DraftHandleValue, EditorState, RichUtils,} from "draft-js";
import {EditorPlugin} from "../index";
import {TodoBlock} from "./TodoBlock";
import './index.css';
import {isRange} from "../utils";

/*
Returns default block-level metadata for various block type. Empty object otherwise.
*/
const getDefaultBlockData = (blockType: string, initialData = {}) => {
    if (blockType === 'todo') {
        return {
            checked: false,
        }
    } else {
        return initialData
    }
};

const resetBlockType = (editorState: EditorState, newType = 'unstyled'): EditorState => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const key = selectionState.getStartKey();
    const blockMap = contentState.getBlockMap();
    const block = blockMap.get(key);
    let newText = '';
    const text = block.getText();
    if (block.getLength() >= 2) {
        newText = text.substr(1);
    }
    const newBlock: ContentBlock = block.merge({
        text: newText,
        type: newType,
        data: getDefaultBlockData(newType),
    }) as ContentBlock;
    const newContentState: ContentState = contentState.merge({
        blockMap: blockMap.set(key, newBlock),
        selectionAfter: selectionState.merge({
            anchorOffset: 0,
            focusOffset: 0,
        }),
    }) as ContentState;
    return EditorState.push(editorState, newContentState, 'change-block-type');
};

export function createTodoPlugin(getState: GetState, onChange: StateChange): EditorPlugin {
    return {
        name: 'createTodoPlugin',
        blockRendererFn(block: ContentBlock): any {
            const type = block.getType();
            if (type === 'todo') {
                return {
                    component: TodoBlock,
                    props: {
                        onChange,
                        getState,
                    },
                };
            }
        },
        blockStyleFn(block: ContentBlock): any {
            if (block.getType() === 'todo') {
                return 'block block-todo'
            }
            return null;
        },
        handleBeforeInput(str: string, editorState: EditorState, eventTimeStamp: number): DraftHandleValue {
            if (str !== ']') {
                return 'not-handled';
            }
            /* Get the selection */
            const selection = editorState.getSelection();

            /* Get the current block */
            const currentBlock = editorState.getCurrentContent()
                .getBlockForKey(selection.getStartKey());
            const blockType = currentBlock.getType();
            const blockLength = currentBlock.getLength();
            if (blockLength === 1 && currentBlock.getText() === '[') {
                onChange(resetBlockType(editorState, blockType !== 'todo' ? 'todo' : 'unstyled'));
                return 'handled';
            }
            return "handled";
        },
        handleKeyCommand(command: DraftEditorCommand | string, editorState: EditorState, eventTimeStamp: number): DraftHandleValue {

            if (command === 'split-block') {
                let contentState = editorState.getCurrentContent();
                let selection = editorState.getSelection();

                if (isRange(selection)) {
                    return 'not-handled';
                }

                let block = contentState.getBlockForKey(selection.getFocusKey());

                if (block.getType() !== 'todo') {
                    return 'not-handled';
                }
                if (block.getText() === '') {
                    let newState = RichUtils.toggleBlockType(editorState, 'todo');
                    onChange(newState);
                    return 'handled';
                }
            }
            return 'not-handled';
        }
    }
}