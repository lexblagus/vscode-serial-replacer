import { initialReplacement } from "../../../shared/data";

import type { SerialReplacement } from "../../../shared/replacements";
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
