import type { SerialReplacerData, AppAction } from "./types";
import initialState from "./utils/initial-state";

export function appStateReducer(state: SerialReplacerData = initialState, action: AppAction): SerialReplacerData {
  switch (action.type) {
    /*
    case "SET_INCLUDE_FILES":
      return { ...state, includeFiles: action.payload };

    case "SET_EXCLUDE_FILES":
      return { ...state, excludeFiles: action.payload };

    case "ADD_STEP":
      return { ...state, steps: [...state.steps, action.payload] };

    case "REMOVE_STEP":
      return {
        ...state,
        steps: state.steps.filter((_, i) => i !== action.index),
      };

    case "SET_RESULTS":
      return {
        ...state,
        results: action.payload,
        resultsTotalFiles: action.payload.length,
      };
    */

    default:
      return state;
  }
}