import { useState, useRef } from "react";
import {
  VscodeFormGroup,
  VscodeIcon,
  VscodeLabel,
  VscodeTextfield
} from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import FileTree from "./FileTree";
import { text } from "../utils/etc";
import type { FC } from "react";
import type {
  TextfieldChangeEventHandler,
  TextfieldKeyboardEventHandler,
  VscodeIconMouseEventHandler,
  VscodeTextfieldConstructor
} from "../types/events";

const FileFilters: FC = () => {
  const { state, dispatch } = useAppContext();
  const [rootOpen, setRootOpen] = useState(false);
  const inputFilesToIncludeRef = useRef<VscodeTextfieldConstructor>(null);
  const inputFilesToExcludeRef = useRef<VscodeTextfieldConstructor>(null);

  const handleFilesToIncludeChange: TextfieldChangeEventHandler = (event) => {
    dispatch({
      type: "SET_FILES_TO_INCLUDE",
      payload: inputFilesToIncludeRef.current?.value ?? '',
    });
  };

  const handleFilesToIncludeKeyDown: TextfieldKeyboardEventHandler = (event) => {
    // TODO: arrow history
  };

  const handleFilesToIncludeKeyUp: TextfieldKeyboardEventHandler = (event) => {
    dispatch({
      type: "SET_FILES_TO_INCLUDE",
      payload: inputFilesToIncludeRef.current?.value ?? '',
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
      payload: inputFilesToExcludeRef.current?.value ?? '',
    });
  };

  const handleFilesToExcludeKeyDown: TextfieldKeyboardEventHandler = (event) => {
    // TODO: arrow history
  };

  const handleFilesToExcludeKeyUp: TextfieldKeyboardEventHandler = (event) => {
    dispatch({
      type: "SET_FILES_TO_EXCLUDE",
      payload: inputFilesToExcludeRef.current?.value ?? '',
    });
  };

  const handleExcludeSettingsAndIgnoreFilesClick: VscodeIconMouseEventHandler = (event) => {
    dispatch({
      type: "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES",
      payload: !state.useExcludeSettingsAndIgnoreFiles,
    });
  };

  return (
    <>
      <VscodeFormGroup variant="vertical" className="no-y-margin">
        <VscodeLabel htmlFor="includeFiles" className="text-discreet">
          {t("files to include")}
        </VscodeLabel>
        <VscodeTextfield
          id="includeFiles"
          className="textfield-full"
          placeholder={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
            "{0} for history",
            text["arrow-up-and-down"]
          )})`}
          title={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
            "{0} for history",
            text["arrow-up-and-down"]
          )})`}
          value={state.includeFiles}
          ref={inputFilesToIncludeRef}
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
          placeholder={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
            "{0} for history",
            text["arrow-up-and-down"]
          )})`}
          title={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
            "{0} for history",
            text["arrow-up-and-down"]
          )})`}
          value={state.excludeFiles}
          ref={inputFilesToExcludeRef}
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

      <FileTree />
    </>
  );
};

export default FileFilters;
