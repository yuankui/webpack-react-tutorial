import {AppCommand, CommandType} from "./index";
import {AppStore, EditingPost} from "../store";
import {Post} from "../../backend";

export class UpdateEditingPostCommand extends AppCommand {
    post: EditingPost;

    constructor(post: EditingPost) {
        super();
        this.post = post;
    }

    name(): CommandType {
        return "UpdateEditingPost";
    }

    process(state: AppStore): AppStore {
        let oldPost = state.posts.get(this.post.id);
        const children = oldPost == null || oldPost.children == null? []: oldPost.children;
        const newPost: Post = {
            ...oldPost,
            content: this.post.content,
            title: this.post.title,
            tags: this.post.tags,
            children,
        };
        return {
            ...state,
            posts: state.posts.set(this.post.id, newPost),
            currentPost: this.post,
        }
    }
}