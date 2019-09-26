import {Backend, Post} from "../index";
import uuid from "uuid/v4";

export function createWebBackend() {
    return new WebBackend();
}

export class WebBackend implements Backend {

    async getPost(id: string): Promise<Post|null> {
        let item = localStorage.getItem(id);
        if (item == null) {
            return null;
        }
        return JSON.parse(item);
    }

    async getPosts(): Promise<Array<Post>> {
        let posts: Array<Post> = [];
        for (let i = 0; i < 1000; i++) {
            let key = localStorage.key(i);
            if (key == null) {
                break;
            }
            let value = localStorage.getItem(key);
            if (value == null) {
                continue;
            }
            posts.push(JSON.parse(value));
        }
        return posts;
    }

    saveImage(file: File, id: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = ev => {
                resolve(reader.result as string);
            };
            reader.onerror = ev => {
                reject(ev);
            };
            reader.onabort = ev => {
                reject(ev);
            };

            reader.readAsDataURL(file);
        })
    }

    async savePost(post: Post): Promise<Post> {
        let id = post.id;
        if (post.id == null) {
           id = uuid();
        }

        let newPost: Post = {
            ...post,
            id,
        };

        localStorage.setItem(id, JSON.stringify(newPost));
        return newPost;
    }

}