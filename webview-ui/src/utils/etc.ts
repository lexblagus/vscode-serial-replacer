import { treeItemConfig } from "./tree-config";
import { t } from "@vscode/l10n";
import type { CombineSequentialReducers } from "../types/reducers";
import type { TreeItem, TreeItemAction } from "../types/tree";
import type { Files } from "../../../src/types";

export const text: Record<string, string> = {
  "sample-file-pattern": "*.ts, src/**/include",
  "arrow-up-and-down": "\u21C5",
};

export const treeItemActionToggle: TreeItemAction = {
  icon: "expand-all",
  actionId: "toggle",
  tooltip: t("expand all"),
};

export const treeItemActionRefresh: TreeItemAction = {
  icon: "refresh",
  actionId: "refresh",
  tooltip: t("refresh"),
};

export const combineSequentialReducers: CombineSequentialReducers =
  (...reducers) =>
  (state, action) =>
    reducers.reduce((currentState, reducer) => reducer(currentState, action), state);

export const insertAtPosition = <T>(array: T[], item: T, position: number): T[] => {
  const length = array.length;
  let index = position >= 0 ? position : length + position;
  index = Math.max(0, Math.min(index, length));
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const changePosition = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const copy = [...array];
  const length = copy.length;

  // Normalize negative indices
  const from = fromIndex < 0 ? length + fromIndex : fromIndex;
  const to = toIndex < 0 ? length + toIndex : toIndex;

  if (from < 0 || from >= length || to < 0 || to > length) return copy;

  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);

  return copy;
};

export const removeAtIndex = <T>(array: T[], index: number): T[] => {
  if (index < 0 || index >= array.length) return [...array];
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

const parentPath = (fullPath: string) => `${fullPath.split("/").slice(0, -1).join('/')}/`;

const basename = (fullPath: string) => fullPath.split("/").filter(Boolean).pop() || "(error: file basename not parsed)";

const flatFilesToTree = (
  fileList: string[],
  startingPath: string,
  defaultItemProps: Partial<TreeItem>
): TreeItem[] => {
  const root: TreeItem[] = [];

  for (const filePath of fileList) {
    const relativePath = filePath.replace(startingPath, "").replace(/^\/+/, "");
    const parts = relativePath.split("/").filter(Boolean);
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let existing = currentLevel.find((item) => item.label === part);

      if (!existing) {
        const absolutePath = `${startingPath}/${parts.slice(0, i + 1).join("/")}`;
        existing = {
          ...defaultItemProps,
          ...{
            actions: [
              ...(i === parts.length - 1 ? [] : [treeItemActionToggle]),
              ...(defaultItemProps.actions ?? []),
            ],
          },
          label: part,
          value: absolutePath,
          tooltip: absolutePath,
        };
        currentLevel.push(existing);
      }

      if (i < parts.length - 1) {
        if (!existing.subItems) {
          existing.subItems = [];
        }
        currentLevel = existing.subItems;
      }
    }
  }

  return root;
};

export const parseFileTree = (files: Files): TreeItem[] => {
  let output: TreeItem[] = [];

  if (files.workspaces.length === 0) {
    for (const file of files.files) {
      output.push({
        ...treeItemConfig,
        label: basename(file),
        value: file,
        tooltip: file,
      });
    }
    return output;
  }

  for (const workspaceFolder of files.workspaces.filter((workspace) =>
    files.files.some((file) => file.startsWith(workspace))
  )) {
    const rePrefix = new RegExp(`^${workspaceFolder}`);
    output.push({
      ...treeItemConfig,
      ...{
        actions: [treeItemActionToggle, ...(treeItemConfig.actions ?? [])],
      },
      label: basename(workspaceFolder),
      description: files.workspaces.filter(item => basename(item) === basename(workspaceFolder)).length > 1 ? basename(parentPath(workspaceFolder)) : undefined,
      value: workspaceFolder,
      tooltip: workspaceFolder,
      subItems: flatFilesToTree(
        files.files.filter((item) => rePrefix.test(item)),
        workspaceFolder,
        treeItemConfig
      ),
    });
  }
  files.files
    .filter(
      (file) => !files.workspaces.some((workspaceFolder) => file.startsWith(workspaceFolder))
    )
    .map((fileOutsideWorkspaces) => {
      output.push({
        ...treeItemConfig,
        label: basename(fileOutsideWorkspaces),
        description: parentPath(fileOutsideWorkspaces),
        value: fileOutsideWorkspaces,
        tooltip: fileOutsideWorkspaces,
      });
    });
  return output;
};
