import type { FC } from "react";
import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import type { VscodeIconMouseEventHandler } from "../types";

export const StepActions: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const step = state.steps[index];

  const handleStepActionEditClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepMoveDownClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepMoveUpClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepAddBellowClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepAddAboveClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepDisableClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepRemoveClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  return (
    <>
      <VscodeIcon
        action-icon
        aria-role="button"
        slot="decorations"
        name="edit"
        label={t("rename")}
        title={t("rename")}
        onClick={handleStepActionEditClick}></VscodeIcon>
      {state.steps.length > 1 && (
        <>
          {index + 1 < state.steps.length ? (
            <VscodeIcon
              action-icon
              aria-role="button"
              slot="decorations"
              name="arrow-down"
              label={t("move down")}
              title={t("move down")}
              onClick={handleStepMoveDownClick}></VscodeIcon>
          ) : (
            <VscodeIcon
              action-icon
              aria-role="presentation"
              slot="decorations"
              name="blank"></VscodeIcon>
          )}
          {index > 0 ? (
            <VscodeIcon
              action-icon
              aria-role="button"
              slot="decorations"
              name="arrow-up"
              label={t("move up")}
              title={t("move up")}
              onClick={handleStepMoveUpClick}></VscodeIcon>
          ) : (
            <VscodeIcon
              action-icon
              aria-role="presentation"
              slot="decorations"
              name="blank"></VscodeIcon>
          )}
        </>
      )}
      <VscodeIcon
        action-icon
        aria-role="button"
        slot="decorations"
        name="debug-step-into"
        label={t("add step bellow")}
        title={t("add step bellow")}
        onClick={handleStepAddBellowClick}></VscodeIcon>
      <VscodeIcon
        action-icon
        aria-role="button"
        slot="decorations"
        name="debug-step-out"
        label={t("add step above")}
        title={t("add step above")}
        onClick={handleStepAddAboveClick}></VscodeIcon>
      {state.steps.length > 1 && (
        <>
          <VscodeIcon
            action-icon
            aria-role="button"
            slot="decorations"
            name="circle-slash"
            label={t("disable")}
            title={t("disable")}
            onClick={handleStepDisableClick}></VscodeIcon>
          <VscodeIcon
            action-icon
            aria-role="button"
            slot="decorations"
            name="trash"
            label={t("remove")}
            title={t("remove")}
            onClick={handleStepRemoveClick}></VscodeIcon>
        </>
      )}
    </>
  );
};

export const StepFindActions: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const step = state.steps[index];

  const handleStepFindRegExpClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepFindGlobalClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepFindMultilineClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepFindCaseSensitiveClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepFindWordWrapClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  return (
    <>
      <VscodeIcon
        name="regex"
        id={`step${index}FindRegExp`}
        title={t("Use regular expression")}
        action-icon
        onClick={handleStepFindRegExpClick}></VscodeIcon>
      <VscodeIcon
        name="globe"
        id={`step${index}FindGlobal`}
        title={t("Find all occurrences (global)")}
        action-icon
        onClick={handleStepFindGlobalClick}></VscodeIcon>
      <VscodeIcon
        name="newline"
        id={`step${index}FindMultiline`}
        title={t("Search across lines (multiline)")}
        action-icon
        onClick={handleStepFindMultilineClick}></VscodeIcon>
      <VscodeIcon
        name="case-sensitive"
        id={`step${index}FindCaseSensitive`}
        title={t("Case sensitive")}
        action-icon
        onClick={handleStepFindCaseSensitiveClick}></VscodeIcon>
      <VscodeIcon
        name="word-wrap"
        id={`step${index}FindWordWrap`}
        title={t("Word wrap")}
        action-icon
        onClick={handleStepFindWordWrapClick}></VscodeIcon>
    </>
  );
};

export const StepReplaceActions: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const step = state.steps[index];

  const handleStepReplaceWordWrapClick: VscodeIconMouseEventHandler = (event) => {
    // TODO
  };

  return (
    <>
      <VscodeIcon
        name="word-wrap"
        id={`step${index}ReplaceWordWrap`}
        title={t("Word wrap")}
        action-icon
        onClick={handleStepReplaceWordWrapClick}></VscodeIcon>
    </>
  );
};
