import type { SerialReplacement, AppAction } from "../types";

type Reducer = (state: SerialReplacement, action: AppAction) => SerialReplacement;

export function combineSequentialReducers(...reducers: Reducer[]) {
  return (state: SerialReplacement, action: AppAction): SerialReplacement =>
    reducers.reduce((currentState, reducer) => reducer(currentState, action), state);
}
