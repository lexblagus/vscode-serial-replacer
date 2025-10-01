import { useEffect } from "react";
import { vscode } from "../utils/vscode";

import type { PersistentHistory } from "../../../shared/replacements";

/**
 * Persists field history to VSCode whenever it changes.
 */
export function usePersistFieldHistory(fieldHistory: PersistentHistory) {
  useEffect(() => {
    console.log("● usePersistFieldHistory: sending updated field history");

    vscode.postMessage({
      command: "PERSIST_FIELD_HISTORY",
      payload: fieldHistory,
    });
  }, [fieldHistory]);
}
