import type { TreeItem } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";
import { t } from "@vscode/l10n";

export const treeItemConfig: Pick<TreeItem, 'icons' | 'actions'> = {
  icons: {
    branch: "folder",
    open: "folder-opened",
    leaf: "file",
  },
  actions: [
    {
      icon: "close",
      actionId: "remove",
      tooltip: t("Remove"),
    },
  ],
};
