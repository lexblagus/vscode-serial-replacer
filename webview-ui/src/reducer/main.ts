import { emptyWebviewState } from "../../../shared/data";
import { getPreloadConfig } from "../utils/etc";

import type { WebviewState } from "../../../shared/replacements";
import type { AppAction } from "../types/actions";

export function stepReplaceReducer(state: WebviewState, action: AppAction): WebviewState {
  const historyLimit = getPreloadConfig().fields.historyLimit;

  switch (action.type) {
    case "RESET": {
      return emptyWebviewState();
    }

    case "SET_FIELD_HISTORY": {
      const { field, value } = action.payload;
      const history = state.fieldHistory[field];

      if (
        (history.length === 0 && history[0] === "") ||
        (history.length >= 1 && history[0] === value) ||
        (history.length >= 2 && history[0] === "" && history[1] === value)
      ) {
        return state;
      }

      return {
        ...state,
        fieldHistory: {
          ...state.fieldHistory,
          [field]: (history[0] === ""
            ? // replace empty first
              [value, ...history.slice(1)]
            : // append normally
              [value, ...history]
          ).slice(0, historyLimit),
        },
      };
    }

    case "SET_TRANSIENT_DATA": {
      return {
        ...state,
        transient: {
          ...state.transient,
          ...action.payload,
          historyFieldIndex: {
            ...state.transient.historyFieldIndex,
            ...action.payload.historyFieldIndex,
          },
        },
      };
    }

    case "SET_PERSISTED_DATA": {
      return {
        ...state,
        fieldHistory: action.payload.history,
        loaded: {
          ...action.payload.replacementParameters,
          results: [],
          resultsTotalFiles: 0,
        },
      };
    }

    default:
      return state;
  }
}

export default stepReplaceReducer;
