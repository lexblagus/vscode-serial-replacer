import type { SerialReplacement } from "../types/app";
import type { AppAction } from "../types/actions";

type Reducer = (state: SerialReplacement, action: AppAction) => SerialReplacement;

export function combineSequentialReducers(...reducers: Reducer[]) {
  return (state: SerialReplacement, action: AppAction): SerialReplacement =>
    reducers.reduce((currentState, reducer) => reducer(currentState, action), state);
}
