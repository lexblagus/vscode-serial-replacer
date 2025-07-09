import { CombineSequentialReducers } from "../types/reducers";
import type { TreeItem } from "../types/tree";

export const combineSequentialReducers: CombineSequentialReducers = (...reducers) => (state, action) =>
    reducers.reduce((currentState, reducer) => reducer(currentState, action), state);

export const insertAtPosition = <T>(array: T[], item: T, position: number): T[] => {
  const length = array.length;
  let index = position >= 0 ? position : length + position;
  index = Math.max(0, Math.min(index, length));
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const changePosition = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const copy = [...array];
  const length = copy.length;

  // Normalize negative indices
  const from = fromIndex < 0 ? length + fromIndex : fromIndex;
  const to = toIndex < 0 ? length + toIndex : toIndex;

  if (from < 0 || from >= length || to < 0 || to > length) return copy;

  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);

  return copy;
};

export const removeAtIndex = <T>(array: T[], index: number): T[] => {
  if (index < 0 || index >= array.length) return [...array];
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

/* export const countTreeItems = (items: TreeItem[]): number =>
  items.reduce(
    (count, { subItems }) => count + 1 + (subItems ? countTreeItems(subItems) : 0),
    0
  ); */

export const countTreeItems = (items: TreeItem[]): number =>
  items.reduce((count, item) => {
    if (item.subItems && item.subItems.length > 0) {
      return count + countTreeItems(item.subItems);
    }
    return item.icons?.leaf === 'file' ? count + 1 : count;
  }, 0);