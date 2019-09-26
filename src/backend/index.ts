import {RawDraftContentState} from "draft-js";
import {createElectronBackend} from "./electron/ElectronBackend";
import {createWebBackend} from "./web/WebBackend";

export interface Backend {
    /**
     * 存储图像，返回url
     * @param file
     * @param id
     */
    saveImage(file: File, id: string): Promise<string>;

    /**
     * 获取文章属性结构
     */
    getPosts(): Promise<Array<Post>>,

    /**
     * 保存文章
     * @param post
     */
    savePost(post: Post): Promise<Post>,

    /**
     * 获取文章详情
     * @param id
     */
    getPost(id: string): Promise<Post | null>,
}

export interface Post {
    /**
     * id组成规则，创建时间
     */
    id: string,
    parentId: string | null,
    title: string,
    tags: Array<string>,
    content: RawDraftContentState,
    children: Array<string>,
    saved: boolean,
}