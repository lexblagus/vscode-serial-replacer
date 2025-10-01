import { setTreeItemOpen, setTreePreview } from "../utils/tree";
import config from "../config.json";

import type { WebviewState } from "../../../shared/replacements";
import type { AppAction } from "../types/actions";

export function fileFilterReducer(state: WebviewState, action: AppAction): WebviewState {
  switch (action.type) {
    case "SET_FILES_TO_INCLUDE": {
      return {
        ...state,
        loaded: {
          ...state.loaded,
          includeFiles: action.payload,
        },
      };
    }

    case "SET_FILES_TO_EXCLUDE": {
      return {
        ...state,
        loaded: {
          ...state.loaded,
          excludeFiles: action.payload,
        },
      };
    }

    case "SET_USE_CURRENT_EDITORS": {
      return {
        ...state,
        loaded: {
          ...state.loaded,
          useCurrentEditors: action.payload,
        },
      };
    }

    case "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES": {
      return {
        ...state,
        loaded: {
          ...state.loaded,
          useExcludeSettingsAndIgnoreFiles: action.payload,
        },
      };
    }

    case "SET_TREE_PREVIEW": {
      return {
        ...state,
        loaded: {
          ...state.loaded,
          results: setTreePreview(state.loaded.results, action.payload),
        },
      };
    }

    case "SET_FILE_TREE": {
      return {
        ...state,
        loaded: {
          ...state.loaded,
          results: action.payload.tree,
          resultsTotalFiles: action.payload.quantity,
        },
      };
    }

    case "SET_TREE_ITEM_VISIBILITY": {
      return {
        ...state,
        loaded: {
          ...state.loaded,
          results: setTreeItemOpen(state.loaded.results, action.payload.path, action.payload.open),
        },
      };
    }

    case "SET_TREE_ITEM_VISIBILITY_RECURSIVELY": {
      return {
        ...state,
        loaded: {
          ...state.loaded,
          results: setTreeItemOpen(
            state.loaded.results,
            action.payload.path,
            !action.payload.open,
            state.loaded.resultsTotalFiles <= config.maxRecursivellyExpandTree
          ),
        },
      };
    }

    default: {
      return state;
    }
  }
}

export default fileFilterReducer;
