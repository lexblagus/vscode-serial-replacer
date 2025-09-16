import type { SerialReplacement } from "../../../shared/replacers";
import type { AppAction } from "./actions";

export type AppReducer = (state: SerialReplacement, action: AppAction) => SerialReplacement;

export type CombineSequentialReducers = (
  ...r: AppReducer[]
) => (state: SerialReplacement, action: AppAction) => SerialReplacement;
