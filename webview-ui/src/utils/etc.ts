import type { CombineSequentialReducers } from "../types/reducers";
import type { VscodeTextareaConstructor, VscodeTextfieldConstructor } from "../types/dependencies";

export const text: Record<string, string> = {
  "sample-file-pattern": "*.ts, src/**/include",
  "arrow-up-and-down": "\u21C5",
};

export const combineSequentialReducers: CombineSequentialReducers =
  (...reducers) =>
  (state, action) =>
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

  if (from < 0 || from >= length || to < 0 || to > length) {
    return copy;
  }

  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);

  return copy;
};

export const removeAtIndex = <T>(array: T[], index: number): T[] => {
  if (index < 0 || index >= array.length) {
    return [...array];
  }
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const debounce = <F extends (...args: any[]) => void>(fn: F, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const detectNavigationDirection = (
  key: string,
  field: VscodeTextfieldConstructor | VscodeTextareaConstructor
): number => {
  const selectionStart = field.wrappedElement.selectionStart;
  const selectionEnd = field.wrappedElement.selectionEnd;
  const length = field.value.length;

  // Split into lines
  const lines = field.value.split("\n");

  // Find cursor's current line index
  let currentLine = 0;
  let charCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length + 1; // +1 for '\n'
    if (selectionStart < charCount + lineLength) {
      currentLine = i;
      break;
    }
    charCount += lineLength;
  }

  // Single-line behavior (fallback to your original logic)
  if (lines.length === 1) {
    if (key === "ArrowUp") {
      return -1;
    }
    if (key === "ArrowDown") {
      return 1;
    }
    return 0;
  }

  // Multi-line behavior
  if (key === "ArrowUp" && currentLine === 0) {
    return -1;
  }
  if (key === "ArrowDown" && currentLine === lines.length - 1) {
    return 1;
  }

  return 0;
};

export const retrieveIndexHistory = (
  direction: number,
  currentIndex: number,
  history: string[]
) => {
  const calculatedIndex = currentIndex - direction;

  if (calculatedIndex < 0) {
    return 0;
  }

  if (calculatedIndex >= history.length) {
    return history.length - 1;
  }

  return calculatedIndex;
};
