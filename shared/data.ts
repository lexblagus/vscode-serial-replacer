import { v4 as uuidv4 } from "uuid";

import type {
  PersistentData,
  PersistentHistory,
  ReplacementParameters,
  SerialReplacement,
  Step,
  WebviewState,
} from "./replacements";

export const emptyReplacementParameters = (): ReplacementParameters => ({
  id: uuidv4(),
  includeFiles: "",
  useCurrentEditors: true,
  excludeFiles: "",
  useExcludeSettingsAndIgnoreFiles: true,
  steps: [],
});

export const emptyReplacement: () => SerialReplacement = () => ({
  results: [],
  resultsTotalFiles: 0,
  ...emptyReplacementParameters(),
});

export const emptyStep: () => Step = () => ({
  id: uuidv4(),
  enabled: true,
  expanded: false,
  find: {
    content: "",
    regExp: false,
    caseSensitive: false,
    wordWrap: true,
  },
  replace: {
    content: "",
    wordWrap: true,
  },
});

export const initialReplacement: () => SerialReplacement = () => ({
  ...emptyReplacement(),
  steps: [
    {
      ...emptyStep(),
      expanded: true,
    },
  ],
});

export const emptyPersistentData: () => PersistentData = () => ({
  replacementParameters: {
    ...emptyReplacementParameters(),
    steps: [
      emptyStep()
    ]
  },
  history: emptyHistory(),
});

export const emptyHistory: () => PersistentHistory = () => ({
  includeFiles: [],
  excludeFiles: [],
  findContent: [],
  replaceContent: [],
});

export const emptyWebviewState: () => WebviewState = () => ({
  loaded: initialReplacement(),
  transient: {
    historyFieldIndex: {
      includeFiles: 0,
      excludeFiles: 0,
      findContent: 0,
      replaceContent: 0,
    },
  },
  fieldHistory: emptyHistory(),
});
