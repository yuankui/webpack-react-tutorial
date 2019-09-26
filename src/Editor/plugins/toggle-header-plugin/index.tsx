import {StateChange} from "../../Editor";
import {DraftHandleValue, EditorState, RichUtils} from "draft-js";
import * as React from "react";
import {EditorPlugin} from "../index";

const map: any = {
    'command-h1': 'header-one',
    'command-h2': 'header-two',
    'command-h3': 'header-three',
    'command-h4': 'header-four',
    'command-h5': 'header-five',
    'command-h6': 'header-six',
    'command-unstyled': 'unstyled',
};

export function createToggleHeaderPlugin(onChange: StateChange): EditorPlugin {
    return {
        name: 'createToggleHeaderPlugin',
        keyBindingFn: function (e: React.KeyboardEvent): string | null {
            // h1 ----> h6
            if (e.metaKey && 48+1 <= e.keyCode && e.keyCode <= 48 + 6) {
                return 'command-h' + e.key;
            }

            if (e.metaKey && e.key === '0') {
                return 'command-unstyled';
            }
            return null;
        },

        handleKeyCommand(command: string, editorState: EditorState, eventTimeStamp: number): DraftHandleValue {
            if (command.startsWith('command-')) {
                const cmd = map[command];
                let state = RichUtils.toggleBlockType(editorState, cmd);
                onChange(state);
                return 'handled';
            }
            return 'not-handled';
        }
    }
}