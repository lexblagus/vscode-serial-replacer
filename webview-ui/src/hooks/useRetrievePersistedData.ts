import { useEffect } from "react";
import { vscode } from "../utils/vscode";
import { log } from "../utils/log";

/**
 * Requests persisted data from the VSCode extension once on mount.
 */
export function useRetrievePersistedData() {
  log('hook', "useRetrievePersistedData", 'log');

  useEffect(() => {
    log('effect', "useRetrievePersistedData", 'log');

    vscode.postMessage({ command: "RETRIEVE_PERSISTED_DATA" });
  }, []);
}
