import type {
  FilePath,
  HistoryAwareField,
  ReplacementParameters,
  ReplacementResults,
  Step,
  WorkspacesAndFiles,
} from "./replacements";

export type SUBSCRIBE_CHANGES = 'SUBSCRIBE_CHANGES';
export type SET_REPLACEMENT_PARAMETERS = 'SET_REPLACEMENT_PARAMETERS';
export type OPEN_PREVIEW = 'OPEN_PREVIEW';
export type PROMPT_RENAME = 'PROMPT_RENAME';
export type REPLACE_ALL = 'REPLACE_ALL';
export type DISPLAY_INFORMATION_MESSAGE = 'DISPLAY_INFORMATION_MESSAGE';
export type ADD_FIELD_HISTORY = 'ADD_FIELD_HISTORY';
export type CONFIRM_RESET = 'CONFIRM_RESET';

export type WebviewMessage =
  | {
      command: SUBSCRIBE_CHANGES;
      payload: boolean;
    }
  | {
      command: SET_REPLACEMENT_PARAMETERS;
      payload: ReplacementParameters;
    }
  | {
      command: OPEN_PREVIEW;
      payload: FilePath;
    }
  | {
      command: PROMPT_RENAME;
      payload: {
        id: string;
        index: number;
        title: string;
      };
    }
  | {
      command: REPLACE_ALL;
      payload: Step[];
    }
  | {
      command: DISPLAY_INFORMATION_MESSAGE;
      payload: string;
    }
  | {
      command: ADD_FIELD_HISTORY;
      payload: {
        field: HistoryAwareField
        value: string;
      }
    }
  | {
      command: CONFIRM_RESET;
    };

export type ExtensionMessage =
  | { type: "SEND_LOG"; payload: any }
  | { type: "SET_WORKSPACES_FILES"; payload: WorkspacesAndFiles }
  | { type: "SET_PREVIEW"; payload: ReplacementResults }
  | {
      type: "COMMIT_RENAME";
      payload: {
        id: string;
        title: string | undefined;
      };
    }
  | { type: "COMMIT_RESET" };
