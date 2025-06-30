import { KeyboardEventHandler, MouseEventHandler } from "react";
import type {
  VscodeIcon,
  VscodeTextfield,
} from "@vscode-elements/elements/dist/vscode-icon/vscode-icon";
import { TreeItem } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";

export interface Step {
  expanded: boolean;
  title: string;
  find: {
    content: string;
    regExp: boolean;
    global: boolean;
    multiline: boolean;
    caseSensitive: boolean;
    wordWrap: boolean;
  };
  replace: {
    content: string;
    wordWrap: boolean;
  };
}

export interface SerialReplacement {
  includeFiles: string;
  useCurrentEditor: boolean;
  excludeFiles: string;
  useExcludeSettingsAndIgnoreFiles: boolean;
  results: TreeItem[];
  resultsTotalFiles: Number;
  steps: Step[];
}

export type AppAction =
  | { type: "SET_FILES_TO_INCLUDE"; payload: string }
  | { type: "SET_FILES_TO_EXCLUDE"; payload: string }
  | { type: "SET_USE_CURRENT_EDITOR"; payload: boolean }
  | { type: "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES"; payload: boolean }
  | {
      type: "SET_STEP_TITLE";
      payload: {
        index: number;
        title: string;
      };
    }
  | {
      type: "SET_STEP_POSITION";
      payload: {
        index: number;
        position: number;
      };
    }
  | {
      type: "ADD_STEP";
      payload: {
        index: number;
        offset: number; // e.g.: -1, 0: above; 1, 2: bellow
      };
    }
  | {
      type: "SET_STEP_ENABLED";
      payload: {
        index: number;
        enabled: boolean;
      };
    }
  | {
      type: "SET_STEP_FIND";
      payload: {
        index: number;
        find: {
          content: string;
        };
      };
    }
  | {
      type: "SET_STEP_REPLACE";
      payload: {
        index: number;
        replace: {
          content: string;
        };
      };
    }
  | { type: "RESET_STATE" };

export type TextfieldChangeEventHandler = (e: Event) => void;
export type TextareaChangeEventHandler = (e: Event) => void;
export type VscTreeActionMouseEventHandler = (e: VscTreeActionEvent) => void;
export type TextfieldKeyboardEventHandler = KeyboardEventHandler<VscodeTextfield>;
export type VscodeIconMouseEventHandler = MouseEventHandler<VscodeIcon>;
export type VscodeButtonMouseEventHandler = MouseEventHandler<VscodeButton>;
export type LinkMouseEventHandler = MouseEventHandler<HTMLAnchorElement>;
