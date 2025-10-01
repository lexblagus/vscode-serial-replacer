import { t } from "@vscode/l10n";
import { getStats } from "../../../shared/common";

import type { TreeItem, TreeItemAction } from "../../../shared/tree";
import type {
  PathList,
  ReplacementResults,
  WorkspacesAndFiles,
} from "../../../shared/replacements";

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

export const treeItemActionRefresh: TreeItemAction = {
  icon: "refresh",
  actionId: "refresh",
  tooltip: t("refresh"),
};

const basename = (fullPath: string) =>
  fullPath.split("/").filter(Boolean).pop() || "(error: file basename not parsed)";

const parentPath = (fullPath: string) => `${fullPath.split("/").slice(0, -1).join("/")}/`;

const sortTreeItems = (treeItem: TreeItem[]) => {
  treeItem.sort((a, b) => {
    // Folders before files
    const aIsFolder = !!a.subItems;
    const bIsFolder = !!b.subItems;
    if (aIsFolder && !bIsFolder) {
      return -1;
    }
    if (!aIsFolder && bIsFolder) {
      return 1;
    }

    // 'Others' folder last
    const aIsOthers = a.value === values.others;
    const bIsOthers = b.value === values.others;
    if (!aIsOthers && bIsOthers) {
      return -1;
    }
    if (aIsOthers && !bIsOthers) {
      return 1;
    }

    // Hidden files last
    const aIsHidden = a.label.startsWith(".");
    const bIsHidden = b.label.startsWith(".");
    if (!aIsHidden && bIsHidden) {
      return -1;
    }
    if (aIsHidden && !bIsHidden) {
      return 1;
    }

    // Alphabetical order (case-insensitive)
    return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
  });

  for (const item of treeItem) {
    if (item.subItems) {
      sortTreeItems(item.subItems);
    }
  }
};

const fileListToTreeItem = (
  fileList: PathList,
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
      const isFile = i === parts.length - 1;
      let existing = currentLevel.find((item) => item.label === part);

      if (!existing) {
        const absolutePath = `${startingPath}/${parts.slice(0, i + 1).join("/")}`;
        existing = {
          ...defaultItemProps,
          ...{
            actions: [
              ...(isFile ? [] : [treeItemActionToggle]),
              ...(defaultItemProps.actions ?? []),
            ],
          },
          label: part,
          value: absolutePath,
          open: false,
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

export const mergeTreeKeys = (
  currentTree: TreeItem[],
  fromTree: TreeItem[],
  keysToTransfer: (keyof TreeItem)[]
): TreeItem[] =>
  currentTree.map((currentItem) => {
    const fromTreeItem = fromTree.find((fromItem) =>
      "value" in currentItem
        ? fromItem.value === currentItem.value
        : fromItem.label === currentItem.label
    );

    const transferredKeys = keysToTransfer.reduce((acc, key) => {
      if (fromTreeItem && key in fromTreeItem) {
        (acc as any)[key] = fromTreeItem[key];
      }
      return acc;
    }, {} as Partial<TreeItem>);

    const result: TreeItem = {
      ...currentItem,
      ...transferredKeys,
      ...(currentItem.subItems
        ? {
            subItems: mergeTreeKeys(
              currentItem.subItems,
              fromTreeItem?.subItems ?? [],
              keysToTransfer
            ),
          }
        : {}),
    };

    return result;
  });

export const setTreeItemOpen = (
  items: TreeItem[],
  path: number[],
  open: boolean,
  recurseAll = false
): TreeItem[] => {
  if (path.length === 0) {
    return items;
  }

  const [idx, ...rest] = path;

  return items.map((item, i) => {
    if (i !== idx) {
      return item;
    }

    // Update subItems along the path
    const updatedSubItems = item.subItems
      ? setTreeItemOpen(item.subItems, rest, open, recurseAll)
      : item.subItems;

    // If recurseAll is true and this is the target node, apply open recursively
    const applyRecurse = (node: TreeItem): TreeItem => {
      const newSubItems = node.subItems?.map((sub) => applyRecurse(sub));
      return {
        ...node,
        open,
        subItems: newSubItems,
      };
    };

    return rest.length === 0 && recurseAll
      ? applyRecurse({ ...item, subItems: updatedSubItems })
      : {
          ...item,
          open: rest.length === 0 ? open : item.open,
          subItems: updatedSubItems,
        };
  });
};

const traverseTreeItem = (
  treeItem: TreeItem,
  callback: (treeItem: TreeItem) => TreeItem
): TreeItem => {
  const subItems = treeItem.subItems;

  if (subItems) {
    subItems.forEach((subItem, index) => {
      subItems[index] = traverseTreeItem(subItem, callback);
    });
  }

  return callback(treeItem);
};

export const setTreePreview = (
  rootFileTree: TreeItem[],
  previewResults: ReplacementResults
): TreeItem[] => {
  console.log("□ setTreePreview");

  const tree: TreeItem[] = structuredClone(rootFileTree);

  const setCountBadge = (treeItem: TreeItem): TreeItem => {
    if (treeItem.value === values.root) {
      // root (top) folder
      const stats = getStats(previewResults);
      return {
        ...treeItem,
        decorations: [
          {
            content:
              stats.replacementsMade === 0
                ? t("no replacements")
                : stats.replacementsMade === 1
                ? t("One replacement")
                : t("{0} replacements", stats.replacementsMade),
            appearance: "text",
          },
        ],
      };
    }

    if (
      "value" in treeItem &&
      treeItem.value &&
      treeItem.value in previewResults &&
      "replacements" in previewResults[treeItem.value]
    ) {
      const replacements = previewResults[treeItem.value].replacements;

      if (replacements > 0) {
        // replacements in file
        return {
          ...treeItem,
          decorations: [
            previewResults[treeItem.value].errors.length
              ? {
                  content: "",
                  appearance: "filled-circle",
                  color: "var(--vscode-editorError-foreground)",
                }
              : {},
            {
              content: replacements.toString(),
              appearance: treeItem.icons?.leaf === "file" ? "counter-badge" : "text",
            },
          ],
        };
      }

      // No replacements in file
      return {
        ...treeItem,
        decorations: [],
      };
    }

    // Non-root folder
    return {
      ...treeItem,
      decorations: [
        // Count child items
        {
          content: String(
            treeItem.subItems?.reduce((accItem, item) => {
              const count =
                item.decorations?.reduce((accDecoration, decoration) => {
                  return accDecoration + Number(decoration.content ?? 0);
                }, 0) ?? 0;
              return accItem + count;
            }, 0) || ""
          ),
          appearance: "text",
        },
      ],
    };
  };

  tree.forEach((item, index) => {
    tree[index] = traverseTreeItem(item, setCountBadge);
  });

  return tree;
};

export const setFileTree = (
  workspacesAndFiles: WorkspacesAndFiles,
  pastResultTree: TreeItem[]
): TreeItem[] => {
  const workspaces = workspacesAndFiles.workspaces;
  const fileList = workspacesAndFiles.files;
  const resultFilesTree: TreeItem[] = [];

  // No workspace files
  if (workspaces.length === 0) {
    for (const file of fileList) {
      resultFilesTree.push({
        ...treeItemConfig,
        label: basename(file),
        value: file,
        description: parentPath(file),
        tooltip: file,
        open: false,
      });
    }
  }

  if (workspaces.length > 0) {
    // Workspace folder and files (single or multi)
    for (const workspaceFolder of workspaces.filter((workspace) =>
      fileList.some((file) => file.startsWith(workspace))
    )) {
      const rePrefix = new RegExp(`^${workspaceFolder}`);
      resultFilesTree.push({
        ...treeItemConfig,
        ...{
          actions: [treeItemActionToggle, ...(treeItemConfig.actions ?? [])],
        },
        label: basename(workspaceFolder),
        ...(workspaces.filter((item) => basename(item) === basename(workspaceFolder)).length > 1
          ? { description: basename(parentPath(workspaceFolder)) }
          : {}),
        value: workspaceFolder,
        description: parentPath(workspaceFolder),
        tooltip: workspaceFolder,
        open: false,
        subItems: fileListToTreeItem(
          fileList.filter((item) => rePrefix.test(item)),
          workspaceFolder,
          treeItemConfig
        ),
      });
    }

    // Files outside workspaces
    const outsideWorkspaceFiles: TreeItem[] = [];
    fileList
      .filter((file) => !workspaces.some((workspaceFolder) => file.startsWith(workspaceFolder)))
      .map((fileOutsideWorkspaces) => {
        // resultFilesTree.push({
        outsideWorkspaceFiles.push({
          ...treeItemConfig,
          label: basename(fileOutsideWorkspaces),
          description: parentPath(fileOutsideWorkspaces),
          value: fileOutsideWorkspaces,
          tooltip: fileOutsideWorkspaces,
        });
      });
    if (outsideWorkspaceFiles.length > 0) {
      resultFilesTree.push({
        icons: {
          ...treeItemConfig.icons,
          branch: "root-folder",
          open: "root-folder-opened",
        },
        actions: [treeItemActionToggle],
        label: t("others"),
        description: t("(not in workspace folders)"),
        value: values.others,
        subItems: outsideWorkspaceFiles,
      });
    }
  }

  // Compile tree with information root
  const rootTree: TreeItem[] = [
    {
      icons: {
        ...treeItemConfig.icons,
        branch: "root-folder",
        open: "root-folder-opened",
      },
      label: fileList.length === 1 ? t("One file") : t("{0} files", fileList.length.toString()),
      value: values.root,
      open: false,
      actions: [treeItemActionToggle, treeItemActionRefresh],
      subItems: resultFilesTree,
    },
  ];

  const resultTree = mergeTreeKeys(rootTree, pastResultTree, ["open"]);

  sortTreeItems(resultTree);

  return resultTree;
};
