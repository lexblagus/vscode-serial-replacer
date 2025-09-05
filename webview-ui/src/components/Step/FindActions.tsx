import type { FC } from "react";
import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import type { VscodeIconMouseEventHandler } from "../../types/events";

const FindActions: FC<{ index: number }> = ({ index }) => {
  console.log("▶ FindActions");

  const { state, dispatch } = useAppContext();
  const step = state.steps[index];

  const handleStepFindRegExpClick: VscodeIconMouseEventHandler = (event) => {
    console.log("▷ handleStepFindRegExpClick");
    dispatch({
      type: "SET_STEP_FIND_REGEXP",
      payload: {
        index,
        find: {
          regExp: !step.find.regExp,
        },
      },
    });
  };


  const handleStepFindCaseSensitiveClick: VscodeIconMouseEventHandler = (event) => {
    console.log("▷ handleStepFindCaseSensitiveClick");
    dispatch({
      type: "SET_STEP_FIND_CASE_SENSITIVE",
      payload: {
        index,
        find: {
          caseSensitive: !step.find.caseSensitive,
        },
      },
    });
  };

  const handleStepFindWordWrapClick: VscodeIconMouseEventHandler = (event) => {
    console.log("▷ handleStepFindWordWrapClick");
    dispatch({
      type: "SET_STEP_FIND_WORD_WRAP",
      payload: {
        index,
        find: {
          wordWrap: !step.find.wordWrap,
        },
      },
    });
  };

  return (
    <>
      <VscodeIcon
        name="regex"
        title={t("Use regular expression")}
        action-icon
        onClick={handleStepFindRegExpClick}
        aria-pressed={step.find.regExp}></VscodeIcon>
      <VscodeIcon
        name="case-sensitive"
        title={t("Case sensitive")}
        action-icon
        onClick={handleStepFindCaseSensitiveClick}
        aria-pressed={step.find.caseSensitive}></VscodeIcon>
      <VscodeIcon
        name="word-wrap"
        title={t("Word wrap")}
        action-icon
        onClick={handleStepFindWordWrapClick}
        aria-pressed={step.find.wordWrap}></VscodeIcon>
    </>
  );
};

export default FindActions;
