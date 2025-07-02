import { combineSequentialReducers } from "../utils/combineSequentialReducers";
import mainReducer from "./main";
import fileFilterReducer from "./fileFilters";
import stepReducer from "./step";
import stepFindReducer from "./stepFind";
import stepReplaceReducer from "./stepReplace";
import type { SerialReplacement } from "../types/app";
import type { AppAction } from "../types/actions";

const combinedReducer = combineSequentialReducers(
  mainReducer,
  fileFilterReducer,
  stepReducer,
  stepFindReducer,
  stepReplaceReducer
);

export function appStateReducer(state: SerialReplacement, action: AppAction): SerialReplacement {
  return combinedReducer(state, action);
}
