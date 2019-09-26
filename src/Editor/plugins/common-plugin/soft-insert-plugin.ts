import {EditorState, DraftHandleValue, RichUtils} from "draft-js";
import {StateChange} from "../../Editor";
import {EditorPlugin} from "../index";
import React from "react";

export function createSoftInsertPlugin(state: EditorState, onChange: StateChange): EditorPlugin {
    return {
        name: 'createSoftInsertPlugin',
        keyBindingFn(e: React.KeyboardEvent<Element>): string |null {
            if (e.shiftKey && e.key === 'Enter') {
                return 'soft-insert';
            }
            return null;
        },

        handleKeyCommand(command: string, editorState: EditorState, eventTimeStamp: number): DraftHandleValue {
            if (command === 'soft-insert') {
                let newState = RichUtils.insertSoftNewline(editorState);
                onChange(newState);
                return 'handled';
            }
            return 'not-handled';
        }
    }
}