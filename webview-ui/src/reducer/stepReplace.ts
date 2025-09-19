import type { WebviewState } from "../../../shared/replacements";
import type { AppAction } from "../types/actions";

export function stepReplaceReducer(state: WebviewState, action: AppAction): WebviewState {
  switch (action.type) {
    case "SET_STEP_REPLACE":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: state.loaded.steps.map((step, index) => ({
            ...step,
            ...(index === action.payload.index
              ? {
                  ...step,
                  replace: {
                    ...step.replace,
                    content: action.payload.replace.content,
                  },
                }
              : step),
          })),
        },
      };

    case "SET_STEP_REPLACE_WORD_WRAP":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: state.loaded.steps.map((step, index) => ({
            ...step,
            ...(index === action.payload.index
              ? {
                  ...step,
                  replace: {
                    ...step.replace,
                    wordWrap: action.payload.replace.wordWrap,
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

export default stepReplaceReducer;
