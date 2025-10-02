import { useEffect } from "react";
import { vscode } from "../utils/vscode";
import { log } from "../utils/log";

/**
 * Subscribes to file/editor changes in the VSCode extension.
 */
export function useSubscribeChanges(useCurrentEditors: boolean) {
  log('hook', "useSubscribeChanges", 'log', `useCurrentEditors=${JSON.stringify(useCurrentEditors)}`);

  useEffect(() => {
    log('effect', "useSubscribeChanges", 'log', `useCurrentEditors=${JSON.stringify(useCurrentEditors)}`);

    vscode.postMessage({
      command: "SUBSCRIBE_CHANGES",
      payload: useCurrentEditors,
    });
  }, [useCurrentEditors]);
}
