import { t } from "@vscode/l10n";

import type { TreeItem, TreeItemAction } from "../types/tree";

export const treeItemConfig: Pick<TreeItem, "icons" | "actions"> = {
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

export const treeItemActionToggle: TreeItemAction = {
  icon: "expand-all",
  actionId: "toggle",
  tooltip: t("expand all"),
};

export const values = {
  root: "root://",
  others: "others://",
};
