import type { ReplacementParameters, Step } from "../webview-ui/src/types/replacers";

type FilePath = string;

export type PathList = FilePath[];

export type WorkspacesAndFiles<T = PathList> = {
  workspaces: T;
  files: T;
};

export type ReplacementResults = Record<
  FilePath,
  {
    errors: string[];
    replacements: number;
  }
>;

export type WebviewMessage =
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
      command: "CONFIRM_RESET";
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
