import { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import { appStateReducer } from "./reducer";
import { emptyStep, initialReplacement } from "./utils/data";
import { vscode } from "./utils/vscode";
import type { SerialReplacement } from "./types/replacers";
import type { AppAction } from "./types/actions";
import type { ExtensionMessage } from "../../src/types";
import { treeItemConfig } from "./utils/tree-config";
import { parseFileTree } from "./utils/etc";

type AppContextType = {
  state: SerialReplacement;
  dispatch: React.Dispatch<AppAction>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, initialReplacement(), (data) => ({
    ...data,
    steps: data.steps.length > 0 ? data.steps : [emptyStep()],
  }));

  // receives messages from extension ("backend")
  useEffect(() => {
    const handleMessage = (event: MessageEvent<ExtensionMessage>) => {
      console.log(`handleMessage event.data=${JSON.stringify(event.data)}`);

      const message = event.data;

      switch (message.type) {
        case "SET_FILES":
          dispatch({
            type: "SET_FILE_TREE",
            payload: {
              quantity: message.payload.files.length,
              tree: parseFileTree(message.payload),
            }
          });
          break;

        case "SEND_LOG":
          console.log("Received message from extension:", message.payload);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // send initialization message to extension ("backend")
  /*
  useEffect(() => {
    const { includeFiles, excludeFiles, useCurrentEditors, useExcludeSettingsAndIgnoreFiles } =
      state;

    vscode.postMessage({
      command: "INIT",
    });
    vscode.postMessage({
      command: "GET_FILE_CHANGES",
      payload: {
        includeFiles,
        excludeFiles,
        useCurrentEditors,
        useExcludeSettingsAndIgnoreFiles,
      },
    });
  }, []);
  */

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
