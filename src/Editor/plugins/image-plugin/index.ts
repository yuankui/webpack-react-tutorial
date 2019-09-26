import Draft, {ContentBlock, DraftHandleValue, EditorState} from "draft-js";
import {StateChange} from "../../Editor";
import {ImageBlock} from "./ImageBlock";
import {EditorPlugin} from "../index";
import Immutable from "immutable";
import './index.css';

export function createImagePlugin(state: EditorState, onChange: StateChange): EditorPlugin {
    return {
        name: 'createImagePlugin',
        blockRendererFn(block: ContentBlock): any {
            const type = block.getType();
            if (type === 'image') {
                return {
                    component: ImageBlock,
                    props: {
                        state,
                        onChange
                    },
                };
            }
        },
        handlePastedFiles(files: Array<Blob>): DraftHandleValue {
            console.log(files);

            for (let file of files) {
                let reader = new FileReader();
                reader.onload = async () => {
                    const bytes: any = reader.result;
                    if (bytes == null) {
                        return;
                    }

                    const size = await getImageSize(bytes);

                    // new block
                    const newBlock = new Draft.ContentBlock({
                        key: Draft.genKey(),
                        type: "image",
                        text: "",
                        characterList: Immutable.List(),
                        data: Immutable.fromJS(
                            {
                                url: bytes,
                                ...size,
                            }
                        )

                    });
                    const contentState = state.getCurrentContent();
                    const newBlockMap = contentState.getBlockMap().set(newBlock.getKey(), newBlock);
                    const newContent = Draft.ContentState
                        .createFromBlockArray(newBlockMap.toArray())
                        .set('selectionAfter', contentState.getSelectionAfter().merge({
                            anchorKey: newBlock.getKey(),
                            anchorOffset: 0,
                            focusKey: newBlock.getKey(),
                            focusOffset: 0,
                            isBackward: false,
                        })) as Draft.ContentState;


                    const newState = EditorState.push(state, newContent, 'apply-entity');
                    onChange(newState);
                };

                // read file
                reader.readAsDataURL(file);
            }

            return 'handled';
        }
    }
}

/**
 * the hack way
 */
async function getImageSize(url: string): Promise<any> {
    let img = new Image();

    return new Promise((resolve, reject) => {
            img.onload = function (this: GlobalEventHandlers, ev: Event) {
                resolve({
                    width: img.width / 2,
                    height: img.height / 2,
                })
            };
            img.src = url;
        }
    );
}