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
import type { FC } from "react";
import type { TreeItem } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";
import type {
  TextfieldChangeEventHandler,
  TextfieldKeyboardEventHandler,
  VscodeIconMouseEventHandler,
  VscTreeActionMouseEventHandler,
  VscTreeSelectMouseEventHandler,
} from "../types/events";
import { vscode } from "../utils/vscode";

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

  const handleCurrentEditorClick: VscodeIconMouseEventHandler = (event) => {
    dispatch({
      type: "SET_USE_CURRENT_EDITOR",
      payload: !state.useCurrentEditor,
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
    // rootOpen
    console.log('handleTreeAction', event.detail);
  };

  const handleTreeSelect: VscTreeSelectMouseEventHandler = (event) => {
    // TODO
    // rootOpen
    console.log('handleTreeSelect', event.detail);
    if(event.detail.path === '0'){
      setRootOpen(!rootOpen);
    }
  };

  useEffect(() => {
    const { includeFiles, excludeFiles, useCurrentEditor, useExcludeSettingsAndIgnoreFiles } =
      state;

    vscode.postMessage({
      command: "GET_FILES",
      payload: {
        includeFiles,
        excludeFiles,
        useCurrentEditor,
        useExcludeSettingsAndIgnoreFiles,
      },
    });
  }, [
    state.includeFiles,
    state.excludeFiles,
    state.useCurrentEditor,
    state.useExcludeSettingsAndIgnoreFiles,
  ]);

  const treeData: TreeItem[] = useMemo(() => ([
    {
      label: t("{0} files", state.resultsTotalFiles.toString()),
      open: rootOpen,
      actions: [
        {
          icon: "refresh",
          actionId: "refresh",
          tooltip: t("refresh"),
        },
      ],
      subItems: state.results,
    },
  ]), [state.results, state.resultsTotalFiles, rootOpen]);

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
            title={t("Use current editor")}
            action-icon
            onClick={handleCurrentEditorClick}
            aria-pressed={state.useCurrentEditor}></VscodeIcon>
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
