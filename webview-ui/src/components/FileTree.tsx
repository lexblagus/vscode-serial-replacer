import { vscode } from "../utils/vscode";
import { VscodeIcon, VscodeTree } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import type { FC } from "react";
import type {
  VscodeButtonMouseEventHandler,
  VscTreeActionMouseEventHandler,
  VscTreeSelectMouseEventHandler,
} from "../types/events";

const FileTree: FC = () => {
  console.log("▶ FileTree");

  const { state, dispatch } = useAppContext();
  // const [rootOpen, setRootOpen] = useState(false);

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

    if (event.detail.itemType === "branch") {
      console.log("folder toggle");
      console.log("event.detail", event.detail);

      dispatch({
        type: "SET_TREE_ITEM_VISIBILITY",
        payload: {
          open: event.detail.open,
          path: event.detail.path,
        },
      });

      return;
    }
    if (event.detail.itemType === "leaf") {
      console.log("preview (?)");
      console.log("event.detail.value", event.detail.value);
      return;
    }
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
        <VscodeTree
          arrows
          indent={20}
          indentGuides
          data={state.results}
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
