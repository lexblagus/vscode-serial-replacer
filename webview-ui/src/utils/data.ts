import { v4 as uuidv4 } from "uuid";

import type { SerialReplacement, Step } from "../types/replacers";

export const emptyReplacement: () => SerialReplacement = () => ({
  id: uuidv4(),
  includeFiles: "",
  useCurrentEditors: true,
  excludeFiles: "",
  useExcludeSettingsAndIgnoreFiles: true,
  results: [],
  resultsTotalFiles: 0,
  steps: [],
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
