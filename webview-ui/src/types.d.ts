import { KeyboardEventHandler, MouseEventHandler } from "react";
import type { VscodeIcon, VscodeTextfield } from "@vscode-elements/elements/dist/vscode-icon/vscode-icon";
import { TreeItem } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";

export interface SerialReplacerData {
    includeFiles: string
    useCurrentEditor: boolean
    excludeFiles: string
    results: TreeItem[]
    resultsTotalFiles: Number
    steps: {
      expanded: boolean
      title: string
      find: {
        content: string
        regExp: boolean
        global: boolean
        multiline: boolean
        caseSensitive: boolean
        wordWrap: boolean
      }
      replace: {
        content: string
        wordWrap: boolean
      }
      preview: boolean
    }[]
};

export type AppAction =
  /* | { type: "SET_INCLUDE_FILES"; payload: string }
  | { type: "SET_EXCLUDE_FILES"; payload: string }
  | { type: "SET_RESULTS"; payload: TreeItem[] }
  | { type: "ADD_STEP"; payload: SerialReplacerStep }
  | { type: "REMOVE_STEP"; payload: number } // index
  | { type: "UPDATE_STEP"; payload: { index: number; step: SerialReplacerStep } }
  | { type: "MOVE_STEP_UP"; payload: number }
  | { type: "MOVE_STEP_DOWN"; payload: number }
  | { type: "TOGGLE_STEP_EXPANDED"; payload: number } */
  | { type: "RESET_STATE" };

export type TextfieldChangeEventHandler = ((e: Event) => void);
export type TextareaChangeEventHandler = ((e: Event) => void);
export type VscTreeActionMouseEventHandler = ((e: VscTreeActionEvent) => void);
export type TextfieldKeyboardEventHandler = KeyboardEventHandler<VscodeTextfield>;
export type VscodeIconMouseEventHandler = MouseEventHandler<VscodeIcon>;
export type VscodeButtonMouseEventHandler = MouseEventHandler<VscodeButton>;
export type LinkMouseEventHandler = MouseEventHandler<HTMLAnchorElement>;
