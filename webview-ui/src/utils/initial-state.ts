import { type TreeItem } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";
import { t } from "@vscode/l10n";
import { SerialReplacerData } from "../types.d";
import { treeItemConfig } from "./tree-config";

const initialState: SerialReplacerData = {
  includeFiles: "",
  useCurrentEditor: true,
  excludeFiles: "",
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

export default initialState;