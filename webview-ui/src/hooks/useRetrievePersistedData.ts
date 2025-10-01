import { useEffect } from "react";
import { vscode } from "../utils/vscode";

/**
 * Requests persisted data from the VSCode extension once on mount.
 */
export function useRetrievePersistedData() {
  useEffect(() => {
    console.log("● useRetrievePersistedData: requesting saved state");
    vscode.postMessage({ command: "RETRIEVE_PERSISTED_DATA" });
  }, []);
}
