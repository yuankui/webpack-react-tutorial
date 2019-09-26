import {ContentBlock, EditorState} from "draft-js";
import {EditController, StateChange} from "../../Editor";
import {CodeBlock} from "./CodeBlock";
import {EditorPlugin} from "../index";
import './index.css';

/**
 * 这个编辑器目前有bug
 * @param state
 * @param onChange
 * @param controller
 */
export function createCodeBlockPlugin(state: EditorState, onChange: StateChange, controller: EditController): EditorPlugin {
    return {
        blockRendererFn(block: ContentBlock): any {
            const type = block.getType();
            if (type === 'grace-code-block') {
                return {
                    component: CodeBlock,
                    editable: false,
                    props: {
                        state,
                        onChange,
                        editorController: controller,
                    },
                };
            }
        },
        name: 'CodeBlockPlugin',
    }
}

/**
 * 先用简单的编辑器开始吧
 * @param state
 * @param onChange
 */
export function createSimpleCodeBlockPlugin(state: EditorState, onChange: StateChange) {

}