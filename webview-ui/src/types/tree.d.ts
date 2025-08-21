import type {
  VscodeTree,
  TreeItem as VscodeTreeItem,
  TreeItemIconConfig as VscodeTreeItemIconConfig,
  TreeItemAction as VscodeTreeItemAction,
  VscTreeSelectEvent as VscodeTreeSelectEvent,
  VscTreeActionEvent as VscodeTreeActionEvent,
  TreeItemDecoration,
} from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";

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

export type VscTreeSelectEvent = VscodeTreeSelectEvent;
export type VscTreeActionEvent = VscodeTreeActionEvent;
export type VscTreeItemAction = VscodeTreeItemAction;
export type VscTreeDecoration = TreeItemDecoration;
export type VscTree = VscodeTree;
