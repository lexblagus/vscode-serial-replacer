import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";

import type { FC } from "react";
import type { VscodeIconMouseEventHandler } from "../../types/events";

const CurrentEditors: FC = () => {
  console.log("▶ CurrentEditors");

  const {
    state: {
      loaded: { useCurrentEditors },
    },
    dispatch,
  } = useAppContext();

  const handleCurrentEditorsClick: VscodeIconMouseEventHandler = (event) => {
    console.log("▷ handleCurrentEditorsClick");

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
