import {ContentBlock, DraftHandleValue, EditorState, KeyBindingUtil, RichUtils} from "draft-js";
import {StateChange} from "../../Editor";
import {Command, EditorPlugin} from "../index";
import * as React from "react";

export function createCodePlugin(state: EditorState, onChange: StateChange): EditorPlugin {
    return {
        name: 'createCodePlugin',
        keyBindingFn(e: React.KeyboardEvent): string | null {
            if (KeyBindingUtil.hasCommandModifier(e) && e.key === 'e') {
                if (e.shiftKey) {
                    return 'block-code';
                }
                return 'inline-code';
            }
            return null;
        },

        handleKeyCommand(command: Command, editorState: EditorState, eventTimeStamp: number): DraftHandleValue {
            if (command === 'inline-code') {
                let newState = RichUtils.toggleInlineStyle(editorState, 'code');
                onChange(newState);
                return "handled";
            }

            if (command === 'block-code') {
                let newState = RichUtils.toggleBlockType(editorState, 'code-block');
                onChange(newState);
                return 'handled';
            }

            return 'not-handled';
        },
        customStyleMap: {
            'code': {
                background: '#ededeb',
                padding: '2px 4px',
                borderRadius: 5,
                color: '#ea5858',
            },
        },
        blockStyleFn(block: ContentBlock): string {
            if (block.getType() === 'code-block') {
                return 'code-block';
            }
            return "";
        }
    }
}