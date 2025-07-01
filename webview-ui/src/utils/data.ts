import { t } from "@vscode/l10n";
import { SerialReplacement, Step } from "../types";
import { treeItemConfig } from "./tree-config";

export const sampleReplacement: SerialReplacement = {
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
    expanded: Math.random() < 0.25,
    title: Math.random() < 0.25 ? t("Step {0}", (i + 1).toString()) : `Named replacement ${i + 1}`, // should not allow repeated titles
    enabled: Math.random() < 0.75,
    find: {
      content: "",
      regExp: false,
      global: true,
      multiline: true,
      caseSensitive: true,
      wordWrap: true,
    },
    replace: {
      content: "",
      wordWrap: true,
    },
    preview: false,
  })),
};

export const emptyReplacement: SerialReplacement = {
  includeFiles: "",
  useCurrentEditor: true,
  excludeFiles: "",
  useExcludeSettingsAndIgnoreFiles: true,
  results: [],
  resultsTotalFiles: 0,
  steps: [],
};

export const emptyStep: Step = {
  expanded: false,
  title: t("Step {0}", 1),
  enabled: true,
  find: {
    content: '',
    regExp: false,
    global: true,
    multiline: true,
    caseSensitive: false,
    wordWrap: true,
  },
  replace: {
    content: '',
    wordWrap: true,
  },
};
