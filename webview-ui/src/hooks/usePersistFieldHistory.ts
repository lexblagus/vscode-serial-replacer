import { useEffect } from "react";
import { vscode } from "../utils/vscode";
import { log } from "../utils/log";

import type { PersistentHistory } from "../../../shared/replacements";

/**
 * Persists field history to VSCode whenever it changes.
 */
export function usePersistFieldHistory(fieldHistory: PersistentHistory) {
  log('hook', "usePersistFieldHistory", 'log', `fieldHistory=${JSON.stringify(fieldHistory)}`);

  useEffect(() => {
    log('effect', "usePersistFieldHistory", 'log', `fieldHistory=${JSON.stringify(fieldHistory)}`);

    vscode.postMessage({
      command: "PERSIST_FIELD_HISTORY",
      payload: fieldHistory,
    });
  }, [fieldHistory]);
}
