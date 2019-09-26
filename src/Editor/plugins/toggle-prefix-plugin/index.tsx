import {StateChange} from "../../Editor";
import {DraftHandleValue, EditorState, Modifier, RichUtils,} from "draft-js";
import {Command, EditorPlugin} from "../index";
import './index.css';

const prefixMap: any = {
    '-': 'unordered-list-item',
    '*': 'unordered-list-item',
    '1.': 'ordered-list-item',
    '#': 'header-one',
    '##': 'header-two',
    '###': 'header-three',
    '####': 'header-four',
    '#####': 'header-five',
    '######': 'header-six',
    '^': 'code-block',
    '>': 'blockquote',
};

export function createToggleListPlugin(value: EditorState, onChange: StateChange): EditorPlugin {
    return {
        name: 'createToggleListPlugin',
        handleBeforeInput(chars: string, editorState: EditorState, eventTimeStamp: number): DraftHandleValue {
            // 仅仅针对unstyled起作用
            if (isUnstyled(editorState)) {
                return 'not-handled';
            }
            if (chars !== ' ') {
                return 'not-handled';
            }
            // 32 = space
            // prefix is '-'|'*'
            const key = value.getSelection().getAnchorKey();
            const currentBlock = value.getCurrentContent().getBlockMap().get(key);
            const blockType = RichUtils.getCurrentBlockType(editorState);

            // 如果已经是列表了，就忽略
            if (['unordered-list-item', "ordered-list-item"].includes(blockType)) {
                return 'not-handled';
            }

            // 检查当前光标之前的字符，是否满足列表条件,以'-,*,1'开头
            const offset = value.getSelection().getStartOffset();
            const text = currentBlock.getText();
            const prefix = text.substr(0, offset);
            const listType = prefixMap[prefix];
            if (listType === undefined) {
                return 'not-handled'
            }

            // remove prefix
            const newState = RichUtils.toggleBlockType(editorState, listType);
            const selection = newState.getSelection();
            const newSelection: any = selection.set('anchorOffset', 0);

            const removePrefix = Modifier.removeRange(
                newState.getCurrentContent(),
                newSelection,
                "backward",
            );
            const removePrefixState = EditorState.push(editorState, removePrefix, 'remove-range');
            onChange(removePrefixState);
            // 如果是列表，就去掉前缀
            return "handled";
        },

        handleKeyCommand(command: Command, editorState: EditorState, eventTimeStamp: number): DraftHandleValue {
            if (command === "unordered-list1") {
                let state = RichUtils.toggleBlockType(editorState, '');
                onChange(state);
                return 'handled';
            }
            return 'not-handled';
        },
    };
}

function isUnstyled(editorState: EditorState) {
    const blockKey = editorState.getSelection().getFocusKey();
    const block = editorState.getCurrentContent().getBlockForKey(blockKey);
    return block.getType() !== 'unstyled';

}