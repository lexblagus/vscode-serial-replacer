import { useState, type FC } from "react";
import { VscodeIcon, VscodeTree } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { vscode } from "../../utils/vscode";
import { useAppContext } from "../../context";
import { log } from "../../utils/log";

import type {
  VscodeIconMouseEventHandler,
  VscTreeActionMouseEventHandler,
  VscTreeSelectMouseEventHandler,
  VscTreeMouseEventHandler,
} from "../../types/events";

const Preview: FC = () => {
  log('component', "Preview", 'log', 'rendered');

  const { state: { loaded } , dispatch } = useAppContext();
  const [selectedFile, setSelectedFile] = useState<string>();

  const handleRefreshClick: VscodeIconMouseEventHandler = () => {
    log("handler", "handleRefreshClick", "log");

    const {
      id,
      includeFiles,
      excludeFiles,
      useCurrentEditors,
      useExcludeSettingsAndIgnoreFiles,
      steps,
    } = loaded;

    vscode.postMessage({
      command: "SET_REPLACEMENT_PARAMETERS",
      payload: {
        id,
        includeFiles,
        excludeFiles,
        useCurrentEditors,
        useExcludeSettingsAndIgnoreFiles,
        steps,
      },
    });
  };

  const handleTreeAction: VscTreeActionMouseEventHandler = (event) => {
    log("handler", "handleTreeAction", "log", `event.detail=${JSON.stringify(event.detail)}`);

    const {
      id,
      includeFiles,
      excludeFiles,
      useCurrentEditors,
      useExcludeSettingsAndIgnoreFiles,
      steps,
    } = loaded;

    switch (event.detail.actionId) {
      case "refresh": {
        vscode.postMessage({
          command: "SET_REPLACEMENT_PARAMETERS",
          payload: {
            id,
            includeFiles,
            excludeFiles,
            useCurrentEditors,
            useExcludeSettingsAndIgnoreFiles,
            steps,
          },
        });
        break;
      }

      case "toggle": {
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
        const addToExclude = (event.detail.item?.subItems || []).length > 0 ? `${event.detail.value}/**` : event.detail.value;
        const currentExclude = excludeFiles.length > 0 ? [excludeFiles] : [];
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
    log("handler", "handleTreeSelect", "log", `event.detail=${JSON.stringify(event.detail)}`);

    switch (event.detail.itemType) {
      case "branch": {
        dispatch({
          type: "SET_TREE_ITEM_VISIBILITY",
          payload: {
            open: event.detail.open,
            path: event.detail.path.split("/").map(Number),
          },
        });
        setSelectedFile(undefined);
        break;
      }

      case "leaf": {
        setSelectedFile(event.detail.value);
        break;
      }
    }
  };

  const handleTreeDoubleClick: VscTreeMouseEventHandler = (event) => {
    log("handler", "handleTreeDoubleClick", "log", `selectedFile=${JSON.stringify(selectedFile)}`);

    if(selectedFile && selectedFile !== ''){
      vscode.postMessage({
        command: "OPEN_PREVIEW",
        payload: selectedFile,
      });
    }
  };

  return (
    <div className="thick-bottom-margin">
      {loaded.resultsTotalFiles === 0 && (
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
      {loaded.resultsTotalFiles > 0 && (
        <div className="file-tree-wrapper">
          <div>
            <VscodeTree
              indent={12}
              indentGuides
              data={loaded.results}
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

export default Preview;
