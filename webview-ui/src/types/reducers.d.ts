import type { AppAction } from "./actions";
import type { SerialReplacement } from "../../../shared/replacements";

export type AppReducer = (state: SerialReplacement, action: AppAction) => SerialReplacement;

export type CombineSequentialReducers = (
  ...r: AppReducer[]
) => (state: SerialReplacement, action: AppAction) => SerialReplacement;
