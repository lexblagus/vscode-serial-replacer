import type { SerialReplacement } from "../types/replacers";
import type { AppAction } from "../types/actions";

export function fileFilterReducer(state: SerialReplacement, action: AppAction): SerialReplacement {
  switch (action.type) {
    case "SET_FILES_TO_INCLUDE":
      return {
        ...state,
        includeFiles: action.payload,
      };

    case "SET_FILES_TO_EXCLUDE":
      return {
        ...state,
        excludeFiles: action.payload,
      };

    case "SET_USE_CURRENT_EDITOR":
      return {
        ...state,
        useCurrentEditor: action.payload,
      };

    case "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES":
      return {
        ...state,
        useExcludeSettingsAndIgnoreFiles: action.payload,
      };

    default:
      return state;
  }
}

export default fileFilterReducer;
