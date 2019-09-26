import {AppCommand, CommandType} from "./index";
import {AppStore, createEmptyEditingPost} from "../store";
import {buildPostTree, convertToEditingPost} from "../utils";
import {Mapper} from "redux-commands";

export class ReloadPostsCommand extends AppCommand {
    name(): CommandType {
        return "ReloadPosts";
    }

    async process(state: AppStore): Promise<Mapper<AppStore>> {
        let posts = await state.backend.getPosts();
        return (s: AppStore): AppStore => {
            let postTree = buildPostTree(posts);

            let currentPost;
            if (postTree.size !== 0) {
                currentPost = convertToEditingPost(postTree.toArray()[0]);
            } else {
                currentPost = createEmptyEditingPost();
            }

            return {
                ...s,
                posts: postTree,
                currentPost
            }
        }
    }

}