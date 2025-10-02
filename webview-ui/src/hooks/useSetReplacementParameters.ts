import { useEffect } from "react";
import { vscode } from "../utils/vscode";
import { log } from "../utils/log";

import type { SerialReplacement } from "../../../shared/replacements";

/**
 * Sends updated replacement parameters to VSCode whenever they change.
 */
export function useSetReplacementParameters(loaded: SerialReplacement) {
  log("hook", "useSetReplacementParameters", "log", `loaded=${JSON.stringify(loaded)}`);

  const {
    id,
    includeFiles,
    excludeFiles,
    useCurrentEditors,
    useExcludeSettingsAndIgnoreFiles,
    steps,
  } = loaded;

  useEffect(() => {
    log(
      "effect",
      "useSetReplacementParameters",
      "log",
      `fieldHistory=${JSON.stringify({
        id,
        includeFiles,
        excludeFiles,
        useCurrentEditors,
        useExcludeSettingsAndIgnoreFiles,
        steps,
      })}`
    );

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
  }, [id, includeFiles, excludeFiles, useCurrentEditors, useExcludeSettingsAndIgnoreFiles, steps]);
}
