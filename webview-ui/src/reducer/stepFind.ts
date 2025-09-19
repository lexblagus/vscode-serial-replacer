import type { WebviewState } from "../../../shared/replacements";
import type { AppAction } from "../types/actions";

export function stepFindReducer(state: WebviewState, action: AppAction): WebviewState {
  switch (action.type) {
    case "SET_STEP_FIND":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: state.loaded.steps.map((step, index) => ({
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
        },
      };

    case "SET_STEP_FIND_REGEXP":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: state.loaded.steps.map((step, index) => ({
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
        },
      };

    case "SET_STEP_FIND_CASE_SENSITIVE":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: state.loaded.steps.map((step, index) => ({
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
        },
      };

    case "SET_STEP_FIND_WORD_WRAP":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: state.loaded.steps.map((step, index) => ({
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
        },
      };

    default:
      return state;
  }
}

export default stepFindReducer;
