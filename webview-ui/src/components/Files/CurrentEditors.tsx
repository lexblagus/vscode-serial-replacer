import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import { log } from "../../utils/log";

import type { FC } from "react";
import type { VscodeIconMouseEventHandler } from "../../types/events";

const CurrentEditors: FC = () => {
  log('component', "CurrentEditors", 'log', 'rendered');

  const {
    state: {
      loaded: { useCurrentEditors },
    },
    dispatch,
  } = useAppContext();

  const handleCurrentEditorsClick: VscodeIconMouseEventHandler = () => {
    log("handler", "handleCurrentEditorsClick", "log");

    dispatch({
      type: "SET_USE_CURRENT_EDITORS",
      payload: !useCurrentEditors,
    });
  };

  return (
    <VscodeIcon
      slot="content-after"
      name="book"
      title={t("Use open editors")}
      action-icon
      onClick={handleCurrentEditorsClick}
      aria-pressed={useCurrentEditors}></VscodeIcon>
  );
};

export default CurrentEditors;
