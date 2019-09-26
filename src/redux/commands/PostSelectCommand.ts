import {AppCommand, CommandType} from "./index";
import {AppStore, EditingPost} from "../store";
import {convertToEditingPost} from "../utils";

export class PostSelectCommand extends AppCommand {
    id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }

    name(): CommandType {
        return "PostSelect";
    }

    process(state: AppStore): AppStore {
        // 2. switch post
        let post = state.posts.get(this.id);
        let currentPost: EditingPost = convertToEditingPost(post);

        return {
            ...state,
            currentPost
        }
    }

}