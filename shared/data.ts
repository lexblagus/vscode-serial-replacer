import { v4 as uuidv4 } from "uuid";

import type {
  PersistentData,
  PersistentHistory,
  ReplacementParameters,
  SerialReplacement,
  Step,
} from "./replacements";

export const emptyReplacementParameters = (): ReplacementParameters => ({
  includeFiles: "",
  useCurrentEditors: true,
  excludeFiles: "",
  useExcludeSettingsAndIgnoreFiles: true,
  steps: [],
});

export const emptyReplacement: () => SerialReplacement = () => ({
  id: uuidv4(),
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
  replacementParameters: emptyReplacementParameters(),
  history: emptyHistory(),
});

export const emptyHistory: () => PersistentHistory = () => ({
  includeFiles: [],
  excludeFiles: [],
  findContent: [],
  replaceContent: [],
});
