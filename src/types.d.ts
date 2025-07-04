import { FileFilters } from "../webview-ui/src/types/replacers";

export type WebviewMessage =
  | {
      command: "INIT";
    }
  | {
      command: "GET_FILES";
      payload: FileFilters,
    }
  | {
      command: "SHOW_INFORMATION_MESSAGE";
      payload: string;
    };

export type ExtensionMessage =
  | { type: "SEND_LOG"; payload: any }
  | { type: "SET_FILES"; payload: string[] };
