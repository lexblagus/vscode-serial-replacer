import { MutableRefObject, useEffect, useRef } from "react";
import { log } from "../utils/log";

import type { WebviewState } from "../../../shared/replacements";

/**
 * Keeps a ref always updated with the latest value.
 * Useful for accessing current state in callbacks/listeners.
 */
export function useStateRefSync(webviewState: WebviewState): MutableRefObject<WebviewState> {
  log('hook', "useStateRefSync", 'log', `webviewState=${JSON.stringify(webviewState)}`);

  const ref = useRef(webviewState);

  useEffect(() => {
    log('effect', "useStateRefSync", 'log', `webviewState=${JSON.stringify(webviewState)}`);
    ref.current = webviewState;
  }, [webviewState]);

  return ref;
}
