import { vscode } from "../utils/vscode";
import { useEffect, useMemo, useState } from "react";
import {
  VscodeFormGroup,
  VscodeIcon,
  VscodeLabel,
  VscodeTextfield,
  VscodeTree,
} from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import content from "../utils/content";
import { treeItemConfig } from "../utils/tree-config";
import type { FC } from "react";
import type { TreeItem } from "../types/tree";
import type {
  TextfieldChangeEventHandler,
  TextfieldKeyboardEventHandler,
  VscodeIconMouseEventHandler,
  VscTreeActionMouseEventHandler,
  VscTreeSelectMouseEventHandler,
} from "../types/events";

const FileFilters: FC = () => {
  const { state, dispatch } = useAppContext();
  const [rootOpen, setRootOpen] = useState(false);

  const handleFilesToIncludeChange: TextfieldChangeEventHandler = (event) => {
    dispatch({
      type: "SET_FILES_TO_INCLUDE",
      payload: (event.target as HTMLInputElement).value,
    });
  };

  const handleFilesToIncludeKeyDown: TextfieldKeyboardEventHandler = (event) => {
    // TODO: arrow history
  };

  const handleFilesToIncludeKeyUp: TextfieldKeyboardEventHandler = (event) => {
    dispatch({
      type: "SET_FILES_TO_INCLUDE",
      payload: (event.target as HTMLInputElement).value,
    });
  };

  const handleCurrentEditorsClick: VscodeIconMouseEventHandler = (event) => {
    dispatch({
      type: "SET_USE_CURRENT_EDITORS",
      payload: !state.useCurrentEditors,
    });
  };

  const handleFilesToExcludeChange: TextfieldChangeEventHandler = (event) => {
    dispatch({
      type: "SET_FILES_TO_EXCLUDE",
      payload: (event.target as HTMLInputElement).value,
    });
  };

  const handleFilesToExcludeKeyDown: TextfieldKeyboardEventHandler = (event) => {
    // TODO: arrow history
  };

  const handleFilesToExcludeKeyUp: TextfieldKeyboardEventHandler = (event) => {
    dispatch({
      type: "SET_FILES_TO_EXCLUDE",
      payload: (event.target as HTMLInputElement).value,
    });
  };

  const handleExcludeSettingsAndIgnoreFilesClick: VscodeIconMouseEventHandler = (event) => {
    dispatch({
      type: "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES",
      payload: !state.useExcludeSettingsAndIgnoreFiles,
    });
  };

  const handleTreeAction: VscTreeActionMouseEventHandler = (event) => {
    // TODO
    console.log("handleTreeAction", event.detail);
    console.log("event.detail.actionId", event.detail.actionId);

    switch(event.detail.actionId){
      case 'expand-all': {
        // TODO
        console.log('expand all')
        break;
      }
      case 'refresh': {
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
      case 'remove': {
        // TODO
        console.log('remove item')
        break;
      }
    }
  };

  const handleTreeSelect: VscTreeSelectMouseEventHandler = (event) => {
    // TODO: open/preview file
    console.log("handleTreeSelect", event.detail);
    if (event.detail.path === "0") {
      setRootOpen(!rootOpen);
    }
  };

  useEffect(() => {
    const { includeFiles, excludeFiles, useCurrentEditors, useExcludeSettingsAndIgnoreFiles } =
      state;

    vscode.postMessage({
      command: "GET_FILE_CHANGES",
      payload: {
        includeFiles,
        excludeFiles,
        useCurrentEditors,
        useExcludeSettingsAndIgnoreFiles,
      },
    });
  }, [
    state.includeFiles,
    state.excludeFiles,
    state.useCurrentEditors,
    state.useExcludeSettingsAndIgnoreFiles,
  ]);

  const treeData: TreeItem[] = useMemo(
    () => [
      {
        icons: treeItemConfig.icons,
        label: t("{0} files", state.resultsTotalFiles.toString()),
        open: rootOpen,
        actions: [
          {
            icon: "expand-all",
            actionId: "expand-all",
            tooltip: t("expand all"),
          },
          {
            icon: "refresh",
            actionId: "refresh",
            tooltip: t("refresh"),
          },
        ],
        subItems: state.results,
      },
    ],
    [state.results, state.resultsTotalFiles, rootOpen]
  );

  return (
    <>
      <VscodeFormGroup variant="vertical" className="no-y-margin">
        <VscodeLabel htmlFor="includeFiles" className="text-discreet">
          {t("files to include")}
        </VscodeLabel>
        <VscodeTextfield
          id="includeFiles"
          className="textfield-full"
          placeholder={`${t("e.g. {0}", content["sample-file-pattern"])} (${t(
            "{0} for history",
            content["arrow-up-and-down"]
          )})`}
          title={`${t("e.g. {0}", content["sample-file-pattern"])} (${t(
            "{0} for history",
            content["arrow-up-and-down"]
          )})`}
          value={state.includeFiles}
          onChange={handleFilesToIncludeChange}
          onKeyDown={handleFilesToIncludeKeyDown}
          onKeyUp={handleFilesToIncludeKeyUp}>
          <VscodeIcon
            slot="content-after"
            name="book"
            title={t("Use open editors")}
            action-icon
            onClick={handleCurrentEditorsClick}
            aria-pressed={state.useCurrentEditors}></VscodeIcon>
        </VscodeTextfield>
      </VscodeFormGroup>

      <VscodeFormGroup variant="vertical" className="no-top-margin">
        <VscodeLabel htmlFor="excludeFiles" className="text-discreet">
          {t("files to exclude")}
        </VscodeLabel>
        <VscodeTextfield
          id="excludeFiles"
          className="textfield-full"
          placeholder={`${t("e.g. {0}", content["sample-file-pattern"])} (${t(
            "{0} for history",
            content["arrow-up-and-down"]
          )})`}
          title={`${t("e.g. {0}", content["sample-file-pattern"])} (${t(
            "{0} for history",
            content["arrow-up-and-down"]
          )})`}
          value={state.excludeFiles}
          onChange={handleFilesToExcludeChange}
          onKeyDown={handleFilesToExcludeKeyDown}
          onKeyUp={handleFilesToExcludeKeyUp}>
          <VscodeIcon
            slot="content-after"
            name="exclude"
            title={t("Use exclude settings and ignore files")}
            action-icon
            onClick={handleExcludeSettingsAndIgnoreFilesClick}
            aria-pressed={state.useExcludeSettingsAndIgnoreFiles}></VscodeIcon>
        </VscodeTextfield>
      </VscodeFormGroup>

      <div className="thick-bottom-margin">
        {state.resultsTotalFiles === 0 && <p className="no-bottom-margin">{t("No files")}</p>}
        {state.resultsTotalFiles === 1 && (
          <p className="no-bottom-margin">{t("Current file: {0}", state.results[0].label)}</p>
        )}
        {state.resultsTotalFiles > 1 && (
          <VscodeTree
            arrows
            indent={20}
            indentGuides
            data={treeData}
            onVscTreeAction={handleTreeAction}
            onVscTreeSelect={handleTreeSelect}
          />
        )}
      </div>
    </>
  );
};

export default FileFilters;
