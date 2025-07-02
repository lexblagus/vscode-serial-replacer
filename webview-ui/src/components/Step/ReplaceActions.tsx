import type { FC } from "react";
import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import type { VscodeIconMouseEventHandler } from "../../types/event-handlers";

const ReplaceActions: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const step = state.steps[index];

  const handleStepReplaceWordWrapClick: VscodeIconMouseEventHandler = (event) => {
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
        title={t("Word wrap: won't affect find/replace behaviour, it's just for visual aid")}
        action-icon
        onClick={handleStepReplaceWordWrapClick}
        aria-pressed={step.replace.wordWrap}></VscodeIcon>
    </>
  );
};

export default ReplaceActions;
