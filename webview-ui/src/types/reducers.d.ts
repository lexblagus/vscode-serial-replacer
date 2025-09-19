import type { AppAction } from "./actions";
import type { WebviewState } from "../../../shared/replacements";

export type AppReducer = (state: WebviewState, action: AppAction) => WebviewState;

export type CombineSequentialReducers = (
  ...r: AppReducer[]
) => (state: WebviewState, action: AppAction) => WebviewState;
