import {convertToRaw, EditorState, RawDraftContentState} from "draft-js";
import uuid from "uuid";
import {AppStore, createEmptyStore, EditingPost} from "./store";
import {Post} from "../backend";
import Immutable from "immutable";

export function createPostId(): string {
    return uuid.v4();
}

export function createEmptyContent(): RawDraftContentState {
    return convertToRaw(EditorState.createEmpty().getCurrentContent());
}

export function initReducer(state: AppStore | undefined, action: any): AppStore {
    if (state !== undefined) {
        return state;
    }
    return createEmptyStore();
}

export function buildPostTree(posts: Array<Post>): Immutable.OrderedMap<string, Post> {
    let map: Immutable.OrderedMap<string, Post> = Immutable.OrderedMap<string, Post>();

    // 1. 构造map
    for (let post of posts) {
        post.children = [];
        map = map.set(post.id, {...post, saved: true});
    }

    // 2. 构造parent
    for (let post of posts) {
        if (post.parentId == null) {
            continue;
        }
        let parent = map.get(post.parentId);
        if (parent == null) {
            post.parentId = null;
        } else {
            parent.children = [...parent.children, post.id];
        }
    }
    return map;
}

export function convertToEditingPost(post: Post): EditingPost {
    return {
        saved: true,
        id: post.id,
        tags: post.tags,
        title: post.title,
        content: post.content,
    }
}

export function convertToPost(currentPost: EditingPost): Post {
    return {
        children: [],
        parentId: null,
        id: currentPost.id,
        title: currentPost.title,
        tags: currentPost.tags,
        content: currentPost.content,
        saved: false,
    }
}