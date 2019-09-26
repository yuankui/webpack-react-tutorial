import {EditorState} from "draft-js";
import {EditorPlugin} from "../index";
import {StateChange} from "../../Editor";

export function createInlineHotkey(state: EditorState,onChange: StateChange): EditorPlugin {
    return {
        name: 'createInlineHotkey',
    }
}