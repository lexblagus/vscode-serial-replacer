import type { SerialReplacement, AppAction } from "./types";
import { emptyReplacement } from "./utils/data";

export function appStateReducer(state: SerialReplacement = emptyReplacement, action: AppAction): SerialReplacement {
  switch (action.type) {
    case "SET_FILES_TO_INCLUDE":
      return {
        ...state,
        includeFiles: action.payload
      };

    case "SET_FILES_TO_EXCLUDE":
      return {
        ...state,
        excludeFiles: action.payload
      };

    case "SET_USE_CURRENT_EDITOR":
      return {
        ...state,
        useCurrentEditor: action.payload
      };

    case "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES":
      return {
        ...state,
        useExcludeSettingsAndIgnoreFiles: action.payload
      };

      
    case "SET_STEP_FIND":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index ? {
            ...step,
            find: {
              ...step.find,
              content: action.payload.find.content
            },
          } : step)
        })),
      };

    case "SET_STEP_REPLACE":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index ? {
            ...step,
            replace: {
              ...step.replace,
              content: action.payload.replace.content
            },
          } : step)
        })),
      };

      default:
        return state;
  }
}