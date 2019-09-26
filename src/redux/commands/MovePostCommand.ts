import {AppCommand, CommandType} from "./index";
import {AppStore} from "../store";
import {Post} from "../../backend";

export class MovePostCommand extends AppCommand {
    childKey: string;
    parentKey: string;

    constructor(childKey: string, parentKey: string) {
        super();
        this.childKey = childKey;
        this.parentKey = parentKey;
    }

    name(): CommandType {
        return "MovePost";
    }

    process(state: AppStore): AppStore {
        const child = state.posts.get(this.childKey);
        const parent = state.posts.get(this.parentKey);

        if (child.parentId === this.parentKey) {
            return state;
        }

        const newChild: Post = {
            ...child,
            parentId: this.parentKey,
            saved: false,
        };

        const newParent: Post = {
            ...parent,
            children: [...parent.children, this.childKey]
        };

        let posts = state.posts
            .set(this.childKey, newChild)
            .set(this.parentKey, newParent);

        if (child.parentId != null) {
            const oldParent = posts.get(child.parentId);
            const children = oldParent.children.filter(key => key !== this.childKey);
            const newOldParent = {
                ...oldParent,
                children
            };

            posts = posts.set(oldParent.id, newOldParent);
        }
        return {
            ...state,
            posts
        }
    }

}