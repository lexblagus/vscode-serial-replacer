import type {
  FilePath,
  HistoryAwareField,
  PersistentData,
  PersistentHistory,
  ReplacementParameters,
  ReplacementResults,
  Step,
  WorkspacesAndFiles,
} from "./replacements";

export type WebviewMessage =
  | {
      command: "RETRIEVE_PERSISTED_DATA";
    }
  | {
      command: "SUBSCRIBE_CHANGES";
      payload: boolean;
    }
  | {
      command: "SET_REPLACEMENT_PARAMETERS";
      payload: ReplacementParameters;
    }
  | {
      command: "OPEN_PREVIEW";
      payload: FilePath;
    }
  | {
      command: "PROMPT_RENAME";
      payload: {
        id: string;
        index: number;
        title: string;
      };
    }
  | {
      command: "REPLACE_ALL";
      payload: Step[];
    }
  | {
      command: "DISPLAY_INFORMATION_MESSAGE";
      payload: string;
    }
  | {
      command: "PERSIST_FIELD_HISTORY";
      payload: PersistentHistory;
    }
  | {
      command: "CONFIRM_RESET";
    };

export type ExtensionMessage =
  | { type: "SEND_LOG"; payload: any }
  | { type: "SET_WORKSPACES_FILES"; payload: WorkspacesAndFiles }
  | { type: "SET_PREVIEW"; payload: ReplacementResults }
  | { type: "SET_PERSISTED_DATA"; payload: PersistentData }
  | {
      type: "COMMIT_RENAME";
      payload: {
        id: string;
        title: string | undefined;
      };
    }
  | { type: "COMMIT_RESET" };
