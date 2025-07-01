import type { SerialReplacement, AppAction } from "../types";
import { emptyReplacement } from "../utils/data";

export function stepReducer(
  state: SerialReplacement = emptyReplacement,
  action: AppAction
): SerialReplacement {
  switch (action.type) {
    case "SET_STEP_EXPANDED":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index
            ? {
                ...step,
                expanded: action.payload.expanded,
              }
            : step),
        })),
      };
    case "SET_STEP_TITLE":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index
            ? {
                ...step,
                title: action.payload.title,
              }
            : step),
        })),
      };
    case "SET_STEP_ENABLED":
      return {
        ...state,
        steps: state.steps.map((step, index) => ({
          ...step,
          ...(index === action.payload.index
            ? {
                ...step,
                enabled: action.payload.enabled,
              }
            : step),
        })),
      };
    default:
      return state;
  }
}
export default stepReducer;
