import { TreeItem } from "webview-ui/src/types/tree";
import { FileFilters } from "../webview-ui/src/types/replacers";

export type WebviewMessage =
  /*
  | {
      command: "INIT";
    }
  */
  | {
      command: "GET_FILE_CHANGES";
      payload: FileFilters,
    }
  | {
      command: "DISPLAY_INFORMATION_MESSAGE";
      payload: string;
    };

export type ExtensionMessage =
  | { type: "SEND_LOG"; payload: any }
  // | { type: "SET_FILES"; payload: string[] };
  | { type: "SET_FILES"; payload: TreeItem[] };
