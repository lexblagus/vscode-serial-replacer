import { emptyWebviewState } from "../../../shared/data";

import type { WebviewState } from "../../../shared/replacements";
import type { AppAction } from "../types/actions";

export function stepReplaceReducer(state: WebviewState, action: AppAction): WebviewState {
  switch (action.type) {
    case "RESET":
      return emptyWebviewState();

    case "SET_PERSISTED_DATA": 
      return {
        fieldHistory: action.payload.history,
        loaded: {
          ...action.payload.replacementParameters,
          results: [],
          resultsTotalFiles: 0,
        }
      };

    default:
      return state;
  }
}

export default stepReplaceReducer;
