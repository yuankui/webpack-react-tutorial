import {AppStore} from "../store";
import {Command} from "redux-commands";

export abstract class AppCommand extends Command<AppStore, CommandType> {
}

export type CommandType = "TestCommand"
    | "KittyCommand"
    | "UpdateEditingPost"
    | "SyncPost"
    | "CreateNewPost"
    | "PostSelect"
    | "SavePosts"
    | "ReloadPosts"
    | "MovePost"
;