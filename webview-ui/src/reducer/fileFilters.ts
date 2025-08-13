import type { SerialReplacement } from "../types/replacers";
import type { AppAction } from "../types/actions";
import { TreeItem } from "../types/tree";
import { mergeOpenState } from "../utils/etc";

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
        results: mergeOpenState(state.results, action.payload.tree),
        resultsTotalFiles: action.payload.quantity,
      };
    }

    case "SET_TREE_ITEM_VISIBILITY": {
      const indexes = action.payload.path.split("/").map(Number);

      const newResults = [...state.results];
      let current: TreeItem[] = newResults;

      for (let i = 0; i < indexes.length; i++) {
        const idx = indexes[i];
        current[idx] = { ...current[idx] }; // shallow copy the item
        if (i === indexes.length - 1) {
          current[idx].open = action.payload.open;
        } else if (current[idx].subItems) {
          current[idx].subItems = [...current[idx].subItems!];
          current = current[idx].subItems!;
        } else {
          break;
        }
      }

      return {
        ...state,
        results: newResults,
      };
    }

    default: {
      return state;
    }
  }
}

export default fileFilterReducer;
