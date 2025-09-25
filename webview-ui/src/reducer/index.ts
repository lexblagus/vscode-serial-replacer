import { combineSequentialReducers } from "../utils/etc";
import mainReducer from "./main";
import fileFilterReducer from "./fileFilters";
import stepReducer from "./step";
import stepFindReducer from "./stepFind";
import stepReplaceReducer from "./stepReplace";

import type { WebviewState } from "../../../shared/replacements";
import type { AppAction } from "../types/actions";

const combinedReducer = combineSequentialReducers(
  mainReducer,
  fileFilterReducer,
  stepReducer,
  stepFindReducer,
  stepReplaceReducer
);

export function appStateReducer(state: WebviewState, action: AppAction): WebviewState {
  const combined = combinedReducer(state, action);
  console.log(`○ appStateReducer parameters=${JSON.stringify({ state, action, combined })}`);
  return combined;
}
