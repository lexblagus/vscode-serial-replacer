import type { FC } from "react";
import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import { log } from "../../utils/log";

import type { VscodeIconMouseEventHandler } from "../../types/events";

const ReplaceActions: FC<{ index: number }> = ({ index }) => {
  log('component', "ReplaceActions", 'log', 'rendered');

  const {
    state: { loaded },
    dispatch,
  } = useAppContext();
  const step = loaded.steps[index];

  const handleStepReplaceWordWrapClick: VscodeIconMouseEventHandler = (event) => {
    log("handler", "handleStepReplaceWordWrapClick", "log");
    dispatch({
      type: "SET_STEP_REPLACE_WORD_WRAP",
      payload: {
        index,
        replace: {
          wordWrap: !step.replace.wordWrap,
        },
      },
    });
  };

  return (
    <>
      <VscodeIcon
        name="word-wrap"
        title={t("Word wrap")}
        action-icon
        onClick={handleStepReplaceWordWrapClick}
        aria-pressed={step.replace.wordWrap}></VscodeIcon>
    </>
  );
};

export default ReplaceActions;
