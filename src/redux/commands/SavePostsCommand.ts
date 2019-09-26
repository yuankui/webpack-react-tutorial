import {AppCommand, CommandType} from "./index";
import {AppStore} from "../store";
import {Post} from "../../backend";
import {Mapper} from "redux-commands";

export class SavePostsCommand extends AppCommand {
    name(): CommandType {
        return "SavePosts";
    }

   async process(state: AppStore): Promise<Mapper<AppStore>> {
       for (let post of state.posts.toArray()) {
           if (!post.saved) {
               await state.backend.savePost(post);
           }
       }
       return s => {
           let posts = s.posts;
           for (let post of state.posts.toArray()) {
               if (!post.saved) {
                   const newPost: Post = {
                       ...post,
                       saved: true,
                   };
                   posts = posts.set(post.id, newPost);
               }
           }
           return {
               ...s,
               posts
           };
       }
   }

}