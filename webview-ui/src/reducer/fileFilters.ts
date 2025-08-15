import type { SerialReplacement } from "../types/replacers";
import type { AppAction } from "../types/actions";
import { setTreeItemOpen } from "../utils/etc";
import prefs from "../prefs.json";

export function fileFilterReducer(state: SerialReplacement, action: AppAction): SerialReplacement {
  switch (action.type) {
    case "SET_FILES_TO_INCLUDE": {
      return {
        ...state,
        includeFiles: action.payload,
      };
    }

    case "SET_FILES_TO_EXCLUDE": {
      return {
        ...state,
        excludeFiles: action.payload,
      };
    }

    case "SET_USE_CURRENT_EDITORS": {
      return {
        ...state,
        useCurrentEditors: action.payload,
      };
    }

    case "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES": {
      return {
        ...state,
        useExcludeSettingsAndIgnoreFiles: action.payload,
      };
    }

    case "SET_FILE_TREE": {
      return {
        ...state,
        results: action.payload.tree,
        resultsTotalFiles: action.payload.quantity,
      };
    }

    case "SET_TREE_ITEM_VISIBILITY": {
      return {
        ...state,
        results: setTreeItemOpen(state.results, action.payload.path, action.payload.open),
      };
    }

    case "SET_TREE_ITEM_VISIBILITY_RECURSIVELY": {
      return {
        ...state,
        results: setTreeItemOpen(
          state.results,
          action.payload.path,
          !action.payload.open,
          state.resultsTotalFiles <= prefs.maxRecursivellyExpandTree
        ),
      };
    }

    default: {
      return state;
    }
  }
}

export default fileFilterReducer;
