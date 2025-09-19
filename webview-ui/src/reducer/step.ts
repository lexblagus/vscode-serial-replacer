import { changePosition, insertAtPosition, removeAtIndex } from "../utils/etc";
import { emptyStep } from "../../../shared/data";

import type { WebviewState } from "../../../shared/replacements";
import type { AppAction } from "../types/actions";

export function stepReducer(state: WebviewState, action: AppAction): WebviewState {
  switch (action.type) {
    case "SET_STEP_EXPANDED":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: state.loaded.steps.map((step, index) => ({
            ...step,
            ...(index === action.payload.index
              ? {
                  ...step,
                  expanded: action.payload.expanded,
                }
              : step),
          })),
        },
      };
    case "SET_STEP_TITLE":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: state.loaded.steps.map((step) => ({
            ...step,
            title: action.payload.id === step.id ? action.payload.title : step.title,
          })),
        },
      };

    case "ADD_STEP":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: insertAtPosition(state.loaded.steps, emptyStep(), action.payload.position),
        },
      };

    case "SET_STEP_POSITION":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: changePosition(state.loaded.steps, action.payload.index, action.payload.position),
        },
      };

    case "SET_STEP_ENABLED":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: state.loaded.steps.map((step, index) => ({
            ...step,
            ...(index === action.payload.index
              ? {
                  ...step,
                  enabled: action.payload.enabled,
                }
              : step),
          })),
        },
      };

    case "REMOVE_STEP":
      return {
        ...state,
        loaded: {
          ...state.loaded,
          steps: removeAtIndex(state.loaded.steps, action.payload.index),
        },
      };

    default:
      return state;
  }
}
export default stepReducer;
