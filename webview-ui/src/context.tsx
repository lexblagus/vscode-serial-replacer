import { createContext, useReducer, useContext, ReactNode, useEffect, useRef } from "react";
import { appStateReducer } from "./reducer";
import { emptyStep, initialReplacement } from "./utils/data";
import { vscode } from "./utils/vscode";
import { setFileTree } from "./utils/etc";

import type { SerialReplacement } from "../../shared/replacers";
import type { AppAction } from "./types/actions";
import type { ExtensionMessage } from "../../shared/extension";

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

  const stateRef = useRef(state);

  // Keep state up-to-date to be used in other hooks
  useEffect(() => {
    console.log("● context/useEffect for state reference");
    stateRef.current = state;
  }, [state]);

  // receives messages from extension ("backend")
  useEffect(() => {
    console.log("● context/useEffect for backend messages");

    const handleMessage = (event: MessageEvent<ExtensionMessage>) => {
      console.log(`▷ handleMessage event.data=${JSON.stringify(event.data)}`);

      const message = event.data;
      const currentState = stateRef.current;

      switch (message.type) {
        case "SET_PREVIEW":
          dispatch({
            type: "SET_TREE_PREVIEW",
            payload: message.payload,
          });
          break;

        case "SET_WORKSPACES_FILES":
          dispatch({
            type: "SET_FILE_TREE",
            payload: {
              quantity: message.payload.files.length,
              tree: setFileTree(message.payload, currentState.results),
            },
          });
          break;

        case "COMMIT_RENAME":
          dispatch({
            type: "SET_STEP_TITLE",
            payload: {
              id: message.payload.id,
              title: message.payload.title,
            },
          });
          break;

        case "COMMIT_RESET":
          dispatch({
            type: "RESET",
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

  // Subscribe to file/editor changes
  useEffect(() => {
    console.log("● context/useEffect for subscribe changes");
    vscode.postMessage({
      command: "SUBSCRIBE_CHANGES",
      payload: state.useCurrentEditors,
    });
  }, [state.useCurrentEditors]);

  // Get file tree when replacement parameters change
  useEffect(() => {
    console.log("● context/useEffect for request file tree");

    const {
      includeFiles,
      excludeFiles,
      useCurrentEditors,
      useExcludeSettingsAndIgnoreFiles,
      steps,
    } = state;

    vscode.postMessage({
      command: "SET_REPLACEMENT_PARAMETERS",
      payload: {
        includeFiles,
        excludeFiles,
        useCurrentEditors,
        useExcludeSettingsAndIgnoreFiles,
        steps,
      },
    });
  }, [
    state.includeFiles,
    state.excludeFiles,
    state.useCurrentEditors,
    state.useExcludeSettingsAndIgnoreFiles,
    state.steps,
  ]);

  // Debug state
  useEffect(() => {
    console.log("state", state);
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
