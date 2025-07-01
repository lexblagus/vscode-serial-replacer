import type { FC } from "react";
import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import type { VscodeIconMouseEventHandler } from "../../types";

const FindActions: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const step = state.steps[index];

  const handleStepFindRegExpClick: VscodeIconMouseEventHandler = (event) => {
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

  const handleStepFindGlobalClick: VscodeIconMouseEventHandler = (event) => {
    dispatch({
      type: "SET_STEP_FIND_GLOBAL",
      payload: {
        index,
        find: {
          global: !step.find.global,
        },
      },
    });
  };

  const handleStepFindMultilineClick: VscodeIconMouseEventHandler = (event) => {
    dispatch({
      type: "SET_STEP_FIND_MULTILINE",
      payload: {
        index,
        find: {
          multiline: !step.find.multiline,
        },
      },
    });
  };

  const handleStepFindCaseSensitiveClick: VscodeIconMouseEventHandler = (event) => {
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
        name="globe"
        title={t("Find all occurrences (global)")}
        action-icon
        onClick={handleStepFindGlobalClick}
        aria-pressed={step.find.global}></VscodeIcon>
      <VscodeIcon
        name="newline"
        title={t("Search across lines (multiline)")}
        action-icon
        onClick={handleStepFindMultilineClick}
        aria-pressed={step.find.multiline}></VscodeIcon>
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
