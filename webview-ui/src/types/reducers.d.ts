import type { SerialReplacement } from "../types/replacers";
import type { AppAction } from "../types/actions";

export type AppReducer = (state: SerialReplacement, action: AppAction) => SerialReplacement;

export type CombineSequentialReducers = (
  ...r: AppReducer[]
) => (state: SerialReplacement, action: AppAction) => SerialReplacement;
