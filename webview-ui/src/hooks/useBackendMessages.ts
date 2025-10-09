import { Dispatch, MutableRefObject, useEffect } from "react";
import { useStateRefSync } from "./useStateRefSync";
import { setFileTree } from "../utils/tree";
import { log } from "../utils/log";
import { setPreloadConfig } from "../utils/etc";

import type { AppAction } from "../types/actions";
import type { ExtensionMessage } from "../../../shared/messages";
import type { WebviewState } from "../../../shared/replacements";

/**
 * Listens for messages from the VSCode extension ("backend")
 * and dispatches state updates accordingly.
 */
export function useBackendMessages(dispatch: Dispatch<AppAction>, state: WebviewState) {
  log("hook", "useBackendMessages", "log", `state=${JSON.stringify(state)}`);
  const stateRef = useStateRefSync(state);

  useEffect(() => {
    log("effect", "useBackendMessages", "log", "Listening for backend messages");

    const handleMessage = (event: MessageEvent<ExtensionMessage>) => {
      log("handler", "handleMessage", "log", `event.data=${JSON.stringify(event.data)}`);

      const message = event.data;

      switch (message.type) {
        case "SET_PERSISTED_DATA": {
          dispatch({ type: message.type, payload: message.payload });
          break;
        }

        case "SET_PREVIEW": {
          dispatch({ type: "SET_TREE_PREVIEW", payload: message.payload });
          break;
        }

        case "SET_WORKSPACES_FILES": {
          dispatch({
            type: "SET_FILE_TREE",
            payload: {
              quantity: message.payload.files.length,
              tree: setFileTree(message.payload, stateRef.current.loaded.results),
            },
          });
          break;
        }

        case "SET_PRELOAD_CONFIG": {
          setPreloadConfig(message.payload);
          break;
        }

        case "COMMIT_RENAME": {
          dispatch({
            type: "SET_STEP_TITLE",
            payload: {
              id: message.payload.id,
              title: message.payload.title,
            },
          });
          break;
        }

        case "COMMIT_RESET": {
          dispatch({ type: "RESET" });
          break;
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch, stateRef]);
}
