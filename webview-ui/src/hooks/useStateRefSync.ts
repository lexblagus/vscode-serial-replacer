import { MutableRefObject, useEffect, useRef } from "react";

import type { WebviewState } from "../../../shared/replacements";

/**
 * Keeps a ref always updated with the latest value.
 * Useful for accessing current state in callbacks/listeners.
 */
export function useStateRefSync(webviewState: WebviewState): MutableRefObject<WebviewState> {
  console.log("● useStateRefSync: update state reference");

  const ref = useRef(webviewState);

  useEffect(() => {
    ref.current = webviewState;
  }, [webviewState]);

  return ref;
}
