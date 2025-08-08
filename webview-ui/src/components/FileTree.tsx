import { vscode } from "../utils/vscode";
import { useMemo, useState } from "react";
import { VscodeIcon, VscodeTree } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import { treeItemConfig } from "../utils/tree-config";
import { treeItemActionRefresh, treeItemActionToggle } from "../utils/etc";
import type { FC } from "react";
import type { TreeItem } from "../types/tree";
import type {
  VscodeButtonMouseEventHandler,
  VscTreeActionMouseEventHandler,
  VscTreeSelectMouseEventHandler,
} from "../types/events";

const FileTree: FC = () => {
  console.log("▶ FileTree");

  const { state, dispatch } = useAppContext();
  const [rootOpen, setRootOpen] = useState(false);

  const handleRefreshClick: VscodeButtonMouseEventHandler = (event) => {
    vscode.postMessage({
      command: "GET_FILE_CHANGES",
      payload: {
        includeFiles: state.includeFiles,
        excludeFiles: state.excludeFiles,
        useCurrentEditors: state.useCurrentEditors,
        useExcludeSettingsAndIgnoreFiles: state.useExcludeSettingsAndIgnoreFiles,
      },
    });
  };

  const handleTreeAction: VscTreeActionMouseEventHandler = (event) => {
    // TODO: tree actions
    console.log("handleTreeAction", event.detail);
    console.log("event.detail.actionId", event.detail.actionId);

    switch (event.detail.actionId) {
      case "toggle": {
        // TODO: expand all
        console.log("toggle expand all");
        break;
      }
      case "refresh": {
        vscode.postMessage({
          command: "GET_FILE_CHANGES",
          payload: {
            includeFiles: state.includeFiles,
            excludeFiles: state.excludeFiles,
            useCurrentEditors: state.useCurrentEditors,
            useExcludeSettingsAndIgnoreFiles: state.useExcludeSettingsAndIgnoreFiles,
          },
        });
        break;
      }
      case "remove": {
        // TODO: remove item
        console.log("remove item", event.detail.value);
        break;
      }
    }
  };

  const handleTreeSelect: VscTreeSelectMouseEventHandler = (event) => {
    // TODO: toggle/preview folder/file
    console.log("handleTreeSelect", event.detail);

    if (event.detail.path === "0" && event.detail.itemType === "branch") {
      console.log("root toggle");
      console.log("event.detail.open", event.detail.open);

      setRootOpen(event.detail.open); // or !rootOpen
      return;
    }

    if (event.detail.path !== "0") {
      if (event.detail.itemType === "branch") {
        console.log("folder toggle");
        console.log("event.detail.value", event.detail.value);
        console.log("event.detail.open", event.detail.open);
        return;
      }
      if (event.detail.itemType === "leaf") {
        console.log("preview (?)");
        console.log("event.detail.value", event.detail.value);
        return;
      }
    }
  };

  const treeData: TreeItem[] = useMemo(
    () => [
      {
        icons: {
          ...treeItemConfig.icons,
          branch: "root-folder",
          open: "root-folder-opened",
        },
        label:
          state.resultsTotalFiles === 1
            ? t("One file")
            : t("{0} files", state.resultsTotalFiles.toString()),
        open: rootOpen,
        actions: [treeItemActionToggle, treeItemActionRefresh],
        subItems: state.results,
      },
    ],
    [state.results, state.resultsTotalFiles, rootOpen]
  );

  return (
    <div className="thick-bottom-margin">
      {state.resultsTotalFiles === 0 && (
        <div className="button-group">
          <div className="button-group-grow">{t("No files")}</div>
          <div>
            <VscodeIcon
              name="refresh"
              title={t("refresh")}
              action-icon
              onClick={handleRefreshClick}></VscodeIcon>
          </div>
        </div>
      )}
      {state.resultsTotalFiles > 0 && (
        <VscodeTree
          arrows
          indent={20}
          indentGuides
          data={treeData}
          onVscTreeAction={handleTreeAction}
          onVscTreeSelect={handleTreeSelect}
          onDoubleClick={(event) => {
            console.log("Double click!", event);
          }}
        />
      )}
    </div>
  );
};

export default FileTree;
