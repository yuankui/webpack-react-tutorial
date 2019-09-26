import {AppCommand, CommandType} from "./index";
import {AppStore} from "../store";
import {Post} from "../../backend";

export class SyncPostCommand extends AppCommand{
    name(): CommandType {
        return "SyncPost";
    }

    process(state: AppStore): AppStore {
        let currentPost = state.currentPost;
        let post = state.posts.get(currentPost.id);


        const newPost: Post = {
            ...post,
            children: post == null? []: post.children,
            id: currentPost.id,
            title: currentPost.title,
            tags: currentPost.tags,
            content: currentPost.content,
            saved: false,
        };

        const posts = state.posts.set(newPost.id, newPost);

        return {
            ...state,
            posts,
        }
    }
}