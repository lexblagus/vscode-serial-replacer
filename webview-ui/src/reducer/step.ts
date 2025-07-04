import { changePosition, insertAtPosition, removeAtIndex } from "../utils/etc";
import { emptyStep } from "../utils/data";
import type { SerialReplacement } from "../types/replacers";
import type { AppAction } from "../types/actions";

export function stepReducer(state: SerialReplacement, action: AppAction): SerialReplacement {
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

    case "ADD_STEP":
      return {
        ...state,
        steps: insertAtPosition(state.steps, emptyStep(), action.payload.position),
      };

    case "SET_STEP_POSITION":
      return {
        ...state,
        steps: changePosition(state.steps, action.payload.index, action.payload.position),
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

    case "REMOVE_STEP":
      return {
        ...state,
        steps: removeAtIndex(state.steps, action.payload.index),
      };

    default:
      return state;
  }
}
export default stepReducer;
