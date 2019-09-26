import {Backend, Post} from "../../backend";
import Immutable from 'immutable';
import {convertToRaw, EditorState, RawDraftContentState} from "draft-js";
import {createPostId} from "../utils";
import {createElectronBackend} from "../../backend/electron/ElectronBackend";
import {createWebBackend} from "../../backend/web/WebBackend";


export interface EditingPost {
    id: string,
    title: string,
    tags: Array<string>,
    saved: boolean,
    content: RawDraftContentState,
}

export function createEmptyEditingPost(): EditingPost {
    return {
        id: createPostId(),
        title: '',
        saved: true,
        tags: [],
        content: convertToRaw(
            EditorState.createEmpty().getCurrentContent()
        ),
    }
}

export interface AppStore {
    currentPost: EditingPost,
    posts: Immutable.OrderedMap<string, Post>,
    editMode: boolean,
    isOpening: boolean,
    backend: Backend,
}

export function createEmptyStore(): AppStore {
    return {
        currentPost: createEmptyEditingPost(),
        isOpening: false,
        editMode: false,
        posts: Immutable.OrderedMap<string, Post>(),
        backend: createBackend(),
    }
}

export function createBackend(): Backend {
    // init backend
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
        // Electron-specific code
        return createElectronBackend("/Users/yuankui/grace-docs");
    } else {
        return createWebBackend();
    }
}