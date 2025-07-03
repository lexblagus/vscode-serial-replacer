import { v4 as uuidv4 } from 'uuid';
import { treeItemConfig } from "./tree-config";
import type { SerialReplacement, Step } from "../types/replacers";

export const sampleReplacement: () => SerialReplacement = () => ({
  id: uuidv4(),
  includeFiles: "",
  useCurrentEditor: true,
  excludeFiles: "",
  useExcludeSettingsAndIgnoreFiles: true,
  results: [
    {
      ...treeItemConfig,
      label: "Folder A",
      subItems: [
        {
          ...treeItemConfig,
          label: "File A1",
        },
      ],
    },
    {
      ...treeItemConfig,
      label: "Folder B",
      open: true,
      subItems: [
        {
          ...treeItemConfig,
          label: "File B1",
        },
        {
          ...treeItemConfig,
          label: "Folder BA",
          open: true,
          subItems: [
            {
              ...treeItemConfig,
              label: "File BA1",
            },
          ],
        },
      ],
    },
  ],
  resultsTotalFiles: Math.floor(Math.random() * 3),
  steps: Array.from({ length: 3 }, (_, i) => ({
    id: uuidv4(),
    title: Math.random() < 0.25 ? undefined : `Named replacement ${i + 1}`, // should not allow repeated titles
    enabled: Math.random() < 0.75,
    expanded: Math.random() < 0.25,
    find: {
      content: "",
      regExp: Math.random() < 0.25,
      global: Math.random() < 0.75,
      multiline: Math.random() < 0.75,
      caseSensitive: Math.random() < 0.75,
      wordWrap: Math.random() < 0.75,
    },
    replace: {
      content: "",
      wordWrap: Math.random() < 0.75,
    },
    preview: false,
  })),
});

export const emptyReplacement: () => SerialReplacement = () => ({
  id: uuidv4(),
  includeFiles: "",
  useCurrentEditor: true,
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
    global: true,
    multiline: true,
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
  steps: [{
    ...emptyStep(),
    expanded: true,
  }],
});
