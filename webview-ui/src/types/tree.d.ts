import type {
  VscodeTreeItem,
  VscodeTreeItemIconConfig,
  VscodeTreeItemAction
} from "./dependencies";

export type TreeItemActionId = "toggle" | "refresh" | "remove";

export interface TreeItemAction extends VscodeTreeItemAction {
  actionId: TreeItemActionId;
}

export interface TreeItem extends VscodeTreeItem {
  subItems?: TreeItem[];
  icons?: VscodeTreeItemIconConfig;
  actions?: TreeItemAction[];
}

export type TreeActionEvent = CustomEvent<{
  actionId: TreeItemActionId;
  item: TreeItem | null;
  value: string;
}>;
