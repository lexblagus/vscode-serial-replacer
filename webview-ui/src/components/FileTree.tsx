import { vscode } from "../utils/vscode";
import { VscodeIcon, VscodeTree } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import { useState, type FC } from "react";
import type {
  VscodeButtonMouseEventHandler,
  VscTreeActionMouseEventHandler,
  VscTreeSelectMouseEventHandler,
  VscTreeMouseEventHandler,
} from "../types/events";

const FileTree: FC = () => {
  console.log("▶ FileTree");

  const { state, dispatch } = useAppContext();
  const [selectedFile, setSelectedFile] = useState<string>();

  const handleRefreshClick: VscodeButtonMouseEventHandler = () => {
    console.log("▷ handleRefreshClick");

    vscode.postMessage({
      command: "GET_FILE_TREE",
      payload: {
        includeFiles: state.includeFiles,
        excludeFiles: state.excludeFiles,
        useCurrentEditors: state.useCurrentEditors,
        useExcludeSettingsAndIgnoreFiles: state.useExcludeSettingsAndIgnoreFiles,
      },
    });
  };

  const handleTreeAction: VscTreeActionMouseEventHandler = (event) => {
    console.log("▷ handleTreeAction", "event.detail", event.detail);

    switch (event.detail.actionId) {
      case "refresh": {
        console.log("○ Refresh");
        vscode.postMessage({
          command: "GET_FILE_TREE",
          payload: {
            includeFiles: state.includeFiles,
            excludeFiles: state.excludeFiles,
            useCurrentEditors: state.useCurrentEditors,
            useExcludeSettingsAndIgnoreFiles: state.useExcludeSettingsAndIgnoreFiles,
          },
        });
        break;
      }

      case "toggle": {
        console.log("○ toggle expand all", "event.detail.item", event.detail.item);
        dispatch({
          type: "SET_TREE_ITEM_VISIBILITY_RECURSIVELY",
          payload: {
            open: !!event.detail.item?.open,
            path: event.detail.item?.path || [],
          },
        });
        break;
      }

      case "remove": {
        console.log("○ Remove item", "event.detail.item", event.detail.value);
        const addToExclude = (event.detail.item?.subItems || []).length > 0 ? `${event.detail.value}/**` : event.detail.value;
        const currentExclude = state.excludeFiles.length > 0 ? [state.excludeFiles] : [];
        dispatch({
          type: "SET_FILES_TO_EXCLUDE",
          payload: [
            ...currentExclude,
            addToExclude,
          ].join(", "),
        });
        break;
      }
    }
  };

  const handleTreeSelect: VscTreeSelectMouseEventHandler = (event) => {
    console.log("▷ handleTreeSelect", "event.detail", event.detail);

    switch (event.detail.itemType) {
      case "branch": {
        console.log("○ folder toggle");

        dispatch({
          type: "SET_TREE_ITEM_VISIBILITY",
          payload: {
            open: event.detail.open,
            path: event.detail.path.split("/").map(Number),
          },
        });
        break;
      }

      case "leaf": {
        console.log(
          "○ File selected",
          "event.detail.value",
          event.detail.value
        );
        setSelectedFile(event.detail.value);
        break;
      }
    }
  };

  const handleTreeDoubleClick: VscTreeMouseEventHandler = (event) => {
    console.log("▷ handleTreeDoubleClick", event);
    // TODO: Preview

    console.log('selectedFile', selectedFile);
    /*
    dispatch({
      type: "PREVIEW_FILE",
      payload: ,
    });
    */
  };

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
        <div className="file-tree-wrapper">
          <div>
            <VscodeTree
              indent={12}
              indentGuides
              data={state.results}
              onVscTreeAction={handleTreeAction}
              onVscTreeSelect={handleTreeSelect}
              onDoubleClick={handleTreeDoubleClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTree;
