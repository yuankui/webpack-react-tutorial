import {SelectionState} from "draft-js";


/**
 * whether select a range
 * @param selection
 */
export function isRange(selection: SelectionState) {
    if (selection.getAnchorKey() !== selection.getFocusKey()) {
        return true;
    }

    if (selection.getAnchorOffset() !== selection.getFocusOffset()) {
        return true;
    }

    return false;
}