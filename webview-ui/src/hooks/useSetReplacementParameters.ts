import { useEffect } from "react";
import { vscode } from "../utils/vscode";

import type { SerialReplacement } from "../../../shared/replacements";

/**
 * Sends updated replacement parameters to VSCode whenever they change.
 */
export function useSetReplacementParameters(loaded: SerialReplacement) {
  const {
    id,
    includeFiles,
    excludeFiles,
    useCurrentEditors,
    useExcludeSettingsAndIgnoreFiles,
    steps,
  } = loaded;

  useEffect(() => {
    console.log("● useSetReplacementParameters: sending updated file tree");

    vscode.postMessage({
      command: "SET_REPLACEMENT_PARAMETERS",
      payload: {
        id,
        includeFiles,
        excludeFiles,
        useCurrentEditors,
        useExcludeSettingsAndIgnoreFiles,
        steps,
      },
    });
  }, [
    id,
    includeFiles,
    excludeFiles,
    useCurrentEditors,
    useExcludeSettingsAndIgnoreFiles,
    steps,
  ]);
}
