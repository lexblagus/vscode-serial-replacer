import { combineSequentialReducers } from "../utils/etc";
import mainReducer from "./main";
import fileFilterReducer from "./fileFilters";
import stepReducer from "./step";
import stepFindReducer from "./stepFind";
import stepReplaceReducer from "./stepReplace";
import type { SerialReplacement } from "../types/replacers";
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
