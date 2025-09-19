import { useEffect, useRef } from "react";
import {
  VscodeFormGroup,
  VscodeIcon,
  VscodeLabel,
  VscodeTextfield,
} from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import FileTree from "./FileTree";
import { useAppContext } from "../context";
import { debounce, detectNavigationDirection, setHistoricField, text } from "../utils/etc";
import config from "../config.json";

import type { FC } from "react";
import type { VscodeIconMouseEventHandler } from "../types/events";
import type { VscodeTextfieldConstructor } from "../types/dependencies";

const FileFilters: FC = () => {
  console.log("▶ FileFilters");

  const {
    state: { loaded },
    dispatch,
  } = useAppContext();
  const textareaIncludeRef = useRef<VscodeTextfieldConstructor>(null);
  const textareaExcludeRef = useRef<VscodeTextfieldConstructor>(null);

  useEffect(() => {
    // Include files textfield handlers
    const textfield = textareaIncludeRef.current;
    if (!textfield) {
      return;
    }

    const handleChange = (event: KeyboardEvent) => {
      console.log("○ handleChange");
      setHistoricField({ dispatch, field: "includeFiles", value: textfield.value });
    };

    const handleKeyUp = debounce((event: KeyboardEvent) => {
      console.log("○ handleKeyUp");
      setHistoricField({ dispatch, field: "includeFiles", value: textfield.value });
    }, config.debounceDelay);

    const handleKeyDown = debounce((event: KeyboardEvent) => {
      console.log("○ handleKeyDown");
      const direction = detectNavigationDirection(event.key, textfield);
      console.log("direction", direction);
      if (direction) {
        // TODO: retrieve history
        // ...
      }
    }, config.debounceDelay);

    textfield.addEventListener("keydown", handleKeyDown);
    textfield.addEventListener("keyup", handleKeyUp);
    textfield.addEventListener("change", handleChange);

    return () => {
      textfield.removeEventListener("keydown", handleKeyDown);
      textfield.removeEventListener("keyup", handleKeyUp);
      textfield.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    // Exclude files textfield handlers
    const textfield = textareaExcludeRef.current;
    if (!textfield) {
      return;
    }

    const handleChange = (event: KeyboardEvent) => {
      console.log("○ handleChange");
      setHistoricField({ dispatch, field: "excludeFiles", value: textfield.value });
    };

    const handleKeyUp = debounce((event: KeyboardEvent) => {
      console.log("○ handleKeyUp");
      setHistoricField({ dispatch, field: "excludeFiles", value: textfield.value });
    }, config.debounceDelay);

    const handleKeyDown = debounce((event: KeyboardEvent) => {
      console.log("○ handleKeyDown");
      const direction = detectNavigationDirection(event.key, textfield);
      console.log("direction", direction);
      if (direction) {
        // TODO: retrieve history
        // ...
      }
    }, config.debounceDelay);

    textfield.addEventListener("keydown", handleKeyDown);
    textfield.addEventListener("keyup", handleKeyUp);
    textfield.addEventListener("change", handleChange);

    return () => {
      textfield.removeEventListener("keydown", handleKeyDown);
      textfield.removeEventListener("keyup", handleKeyUp);
      textfield.removeEventListener("change", handleChange);
    };
  }, []);

  const handleCurrentEditorsClick: VscodeIconMouseEventHandler = (event) => {
    console.log("▷ handleCurrentEditorsClick");

    dispatch({
      type: "SET_USE_CURRENT_EDITORS",
      payload: !loaded.useCurrentEditors,
    });
  };

  const handleExcludeSettingsAndIgnoreFilesClick: VscodeIconMouseEventHandler = (event) => {
    console.log("▷ handleExcludeSettingsAndIgnoreFilesClick");

    dispatch({
      type: "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES",
      payload: !loaded.useExcludeSettingsAndIgnoreFiles,
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
          ref={textareaIncludeRef}
          className="textfield-full"
          placeholder={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
            "{0} for history",
            text["arrow-up-and-down"]
          )})`}
          title={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
            "{0} for history",
            text["arrow-up-and-down"]
          )})`}
          value={loaded.includeFiles}>
          <VscodeIcon
            slot="content-after"
            name="book"
            title={t("Use open editors")}
            action-icon
            onClick={handleCurrentEditorsClick}
            aria-pressed={loaded.useCurrentEditors}></VscodeIcon>
        </VscodeTextfield>
      </VscodeFormGroup>
      <VscodeFormGroup variant="vertical" className="no-top-margin">
        <VscodeLabel htmlFor="excludeFiles" className="text-discreet">
          {t("files to exclude")}
        </VscodeLabel>
        <VscodeTextfield
          id="excludeFiles"
          ref={textareaExcludeRef}
          className="textfield-full"
          placeholder={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
            "{0} for history",
            text["arrow-up-and-down"]
          )})`}
          title={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
            "{0} for history",
            text["arrow-up-and-down"]
          )})`}
          value={loaded.excludeFiles}>
          <VscodeIcon
            slot="content-after"
            name="exclude"
            title={t("Use exclude settings and ignore files")}
            action-icon
            onClick={handleExcludeSettingsAndIgnoreFilesClick}
            aria-pressed={loaded.useExcludeSettingsAndIgnoreFiles}></VscodeIcon>
        </VscodeTextfield>
      </VscodeFormGroup>
      <FileTree />
    </>
  );
};

export default FileFilters;
