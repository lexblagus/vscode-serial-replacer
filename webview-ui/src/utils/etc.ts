import { vscode } from "../utils/vscode";
import { t } from "@vscode/l10n";
import { treeItemActionToggle, treeItemConfig, values } from "./tree-config";
import { getStats } from "../../../shared/common";

import type { Dispatch } from "react";
import type { AppAction } from "../types/actions";
import type { CombineSequentialReducers } from "../types/reducers";
import type { VscodeTextareaConstructor, VscodeTextfieldConstructor } from "../types/dependencies";
import type { TreeItem, TreeItemAction } from "../../../shared/tree";
import type {
  PathList,
  ReplacementResults,
  WorkspacesAndFiles,
  HistoryAwareField,
} from "../../../shared/replacements";

export const text: Record<string, string> = {
  "sample-file-pattern": "*.ts, src/**/include",
  "arrow-up-and-down": "\u21C5",
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

  if (from < 0 || from >= length || to < 0 || to > length) {
    return copy;
  }

  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);

  return copy;
};

export const removeAtIndex = <T>(array: T[], index: number): T[] => {
  if (index < 0 || index >= array.length) {
    return [...array];
  }
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

const parentPath = (fullPath: string) => `${fullPath.split("/").slice(0, -1).join("/")}/`;

const basename = (fullPath: string) =>
  fullPath.split("/").filter(Boolean).pop() || "(error: file basename not parsed)";

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

export const debounce = <F extends (...args: any[]) => void>(fn: F, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const detectNavigationDirection = (
  key: string,
  field: VscodeTextfieldConstructor | VscodeTextareaConstructor
): number => {
  const selectionStart = field.wrappedElement.selectionStart;
  const selectionEnd = field.wrappedElement.selectionEnd;
  const length = field.value.length;

  if (key === "ArrowUp" /* && selectionStart === 0 */) { // TODO: detect multi-line
    return -1;
  }

  if (key === "ArrowDown" /* && selectionEnd === length */) { // TODO: detect multi-line
    return 1;
  }

  return 0;
};

export const setHistoricField = ({ // <!> DELETE?
  dispatch,
  field,
  value,
  index,
}: {
  dispatch: Dispatch<AppAction>;
  field: HistoryAwareField;
  value: string;
  index?: number;
}) => {
  console.log("□ setHistoricField", { field, value, index });

  dispatch({
    type: "SET_FIELD_HISTORY",
    payload: {
      field,
      value,
    },
  });

  switch (field) {
    case "includeFiles": {
      dispatch({ type: "SET_FILES_TO_INCLUDE", payload: value });
      return;
    }
    case "excludeFiles": {
      dispatch({ type: "SET_FILES_TO_EXCLUDE", payload: value });
      return;
    }
    case "findContent": {
      dispatch({
        type: "SET_STEP_FIND",
        payload: {
          index,
          find: {
            content: value,
          },
        },
      });
      return;
    }
    case "replaceContent": {
      dispatch({
        type: "SET_STEP_REPLACE",
        payload: {
          index,
          replace: {
            content: value,
          },
        },
      });
      return;
    }
  }
};

export const retrieveIndexHistory = (direction: number, currentIndex: number, history: string[], ) => {
  const calculatedIndex = currentIndex - direction;

  if(calculatedIndex < 0) {
    return 0;
  }

  if(calculatedIndex >= history.length) {
    return history.length - 1;
  }

  return calculatedIndex;
};
