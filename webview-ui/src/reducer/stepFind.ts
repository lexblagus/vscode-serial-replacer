import type { SerialReplacement, AppAction } from "../types";
import { emptyReplacement } from "../utils/data";

export function stepFindReducer(
  state: SerialReplacement = emptyReplacement,
  action: AppAction
): SerialReplacement {
  switch (action.type) {
    case "SET_STEP_FIND":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index
            ? {
                ...step,
                find: {
                  ...step.find,
                  content: action.payload.find.content,
                },
              }
            : step),
        })),
      };

    case "SET_STEP_FIND_REGEXP":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index
            ? {
                ...step,
                find: {
                  ...step.find,
                  regExp: action.payload.find.regExp,
                },
              }
            : step),
        })),
      };

    case "SET_STEP_FIND_GLOBAL":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index
            ? {
                ...step,
                find: {
                  ...step.find,
                  global: action.payload.find.global,
                },
              }
            : step),
        })),
      };

    case "SET_STEP_FIND_MULTILINE":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index
            ? {
                ...step,
                find: {
                  ...step.find,
                  multiline: action.payload.find.multiline,
                },
              }
            : step),
        })),
      };

    case "SET_STEP_FIND_CASE_SENSITIVE":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index
            ? {
                ...step,
                find: {
                  ...step.find,
                  caseSensitive: action.payload.find.caseSensitive,
                },
              }
            : step),
        })),
      };

    case "SET_STEP_FIND_WORD_WRAP":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index
            ? {
                ...step,
                find: {
                  ...step.find,
                  wordWrap: action.payload.find.wordWrap,
                },
              }
            : step),
        })),
      };

    default:
      return state;
  }
}

export default stepFindReducer;
