import { useEffect } from "react";
import { vscode } from "../utils/vscode";

/**
 * Subscribes to file/editor changes in the VSCode extension.
 */
export function useSubscribeChanges(useCurrentEditors: boolean) {
  useEffect(() => {
    console.log("● useSubscribeChanges: subscribing to file/editor changes");

    vscode.postMessage({
      command: "SUBSCRIBE_CHANGES",
      payload: useCurrentEditors,
    });
  }, [useCurrentEditors]);
}
