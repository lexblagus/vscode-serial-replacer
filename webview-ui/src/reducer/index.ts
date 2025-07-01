import type { SerialReplacement, AppAction } from "../types";
import { emptyReplacement } from "../utils/data";

import { combineSequentialReducers } from "../utils/combineSequentialReducers";
import fileFilterReducer from "./fileFilters";
import stepReducer from "./step";
import stepFindReducer from "./stepFind";
import stepReplaceReducer from "./stepReplace";

const combinedReducer = combineSequentialReducers(
  fileFilterReducer,
  stepReducer,
  stepFindReducer,
  stepReplaceReducer
);

export function appStateReducer(
  state: SerialReplacement = emptyReplacement,
  action: AppAction
): SerialReplacement {
  return combinedReducer(state, action);
}
