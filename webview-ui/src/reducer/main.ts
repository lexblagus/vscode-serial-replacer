import { initialReplacement } from "../utils/data";
import type { SerialReplacement } from "../types/replacers";
import type { AppAction } from "../types/actions";

export function stepReplaceReducer(state: SerialReplacement, action: AppAction): SerialReplacement {
  switch (action.type) {
    case "RESET":
      return initialReplacement();

    default:
      return state;
  }
}

export default stepReplaceReducer;
