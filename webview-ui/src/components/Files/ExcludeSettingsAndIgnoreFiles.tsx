import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";

import type { FC } from "react";
import type { VscodeIconMouseEventHandler } from "../../types/events";

const ExcludeSettingsAndIgnoreFiles: FC = () => {
  console.log("▶ ExcludeSettingsAndIgnoreFiles");

  const {
    state: {
      loaded: { useExcludeSettingsAndIgnoreFiles },
    },
    dispatch,
  } = useAppContext();

  const handleExcludeSettingsAndIgnoreFilesClick: VscodeIconMouseEventHandler = (event) => {
    console.log("▷ handleExcludeSettingsAndIgnoreFilesClick");

    dispatch({
      type: "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES",
      payload: !useExcludeSettingsAndIgnoreFiles,
    });
  };

  return (
    <VscodeIcon
      slot="content-after"
      name="exclude"
      title={t("Use exclude settings and ignore files")}
      action-icon
      onClick={handleExcludeSettingsAndIgnoreFilesClick}
      aria-pressed={useExcludeSettingsAndIgnoreFiles}></VscodeIcon>
  );
};

export default ExcludeSettingsAndIgnoreFiles;
