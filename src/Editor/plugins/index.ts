import {
    ContentBlock,
    DraftEditorCommand,
    DraftHandleValue,
    DraftStyleMap,
    EditorState,
    getDefaultKeyBinding,
} from "draft-js";
import * as React from "react";

export type Command = DraftEditorCommand | string;

export interface EditorPlugin {
    name: string,
    handleKeyCommand?(command: Command, editorState: EditorState, eventTimeStamp: number): DraftHandleValue,

    handleBeforeInput?(chars: string, editorState: EditorState, eventTimeStamp: number): DraftHandleValue,

    keyBindingFn?(e: React.KeyboardEvent): string | null,

    customStyleMap?: DraftStyleMap,

    blockStyleFn?(block: ContentBlock): string,

    // For a given `ContentBlock` object, return an object that specifies
    // a custom block component and/or props. If no object is returned,
    // the default `TextEditorBlock` is used.
    blockRendererFn?(block: ContentBlock): any,

    handlePastedFiles?(files: Array<Blob>): DraftHandleValue,
}

function handlePastedFiles(plugins: Array<EditorPlugin>) {
    return (files: Array<Blob>) => {
        for (let plugin of plugins) {
            if (plugin.handlePastedFiles == null) {
                continue;
            }
            if (plugin.handlePastedFiles(files) === 'handled') {
                return 'handled'
            }
        }
        return 'not-handled';
    }
}

function mergeMap(maps: Array<DraftStyleMap | undefined>): DraftStyleMap {
    if (maps == null) {
        return {};
    }
    let res = {};
    for (let map of maps) {
        if (map != null) {
            res = {...res, ...map};
        }
    }
    return res;
}

function blockRendererFn(plugins: Array<EditorPlugin>) {
    return (block: ContentBlock) => {
        for (let plugin of plugins) {
            if (plugin.blockRendererFn != null) {
                let ret = plugin.blockRendererFn(block);
                if (ret != null) {
                    return ret;
                }
            }
        }
        return null;
    }
}

export function mergePlugins(plugins: Array<EditorPlugin>): EditorPlugin {

    return {
        name: "merged-plugin",
        handleKeyCommand(command: string, editorState: EditorState, eventTimeStamp: number): DraftHandleValue {
            const handled = plugins.some(plugin => {
                if (plugin.handleKeyCommand == null) {
                    return false;
                }
                let result = plugin.handleKeyCommand(command, editorState, eventTimeStamp);

                return result === 'handled';
            });
            return handled ? "handled" : "not-handled";
        },
        handleBeforeInput(chars: string, editorState: EditorState, eventTimeStamp: number): DraftHandleValue {
            const handled = plugins.some(plugin => {
                if (plugin.handleBeforeInput == null) {
                    return false;
                }
                let result = plugin.handleBeforeInput(chars, editorState, eventTimeStamp);

                return result === 'handled';
            });
            return handled ? "handled" : "not-handled";
        },
        keyBindingFn(e: React.KeyboardEvent): string | null {
            for (let plugin of plugins) {
                if (plugin.keyBindingFn == null) {
                    continue;
                }
                let result = plugin.keyBindingFn(e);
                if (result == null) {
                    continue;
                }
                return result;
            }
            return getDefaultKeyBinding(e);
        },

        customStyleMap: mergeMap(plugins.map(p => p.customStyleMap).filter(p => p != null)),

        blockStyleFn(block: ContentBlock): string {
            for (let plugin of plugins) {
                if (plugin.blockStyleFn != null) {
                    const className = plugin.blockStyleFn(block);
                    if (className != null) {
                        return className;
                    }
                }
            }
            return "";
        },

        blockRendererFn: blockRendererFn(plugins),
        handlePastedFiles: handlePastedFiles(plugins),
    }
}

