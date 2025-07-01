import type { FC } from "react";
import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import type { VscodeIconMouseEventHandler } from "../../types";

const Actions: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const step = state.steps[index];

  const preventCollapsibleToggle = () => {
    // FIXME: stop propagation is not working on handlers; temporary fix, hopefully
    dispatch({
      type: "SET_STEP_EXPANDED",
      payload: {
        index,
        expanded: !step.expanded,
      },
    });
  };
  
  const handleStepActionRenameClick: VscodeIconMouseEventHandler = (event) => {
    event.stopPropagation();
    preventCollapsibleToggle();
    // TODO
  };

  const handleStepMoveDownClick: VscodeIconMouseEventHandler = (event) => {
    event.stopPropagation();
    preventCollapsibleToggle();
    // TODO
  };

  const handleStepMoveUpClick: VscodeIconMouseEventHandler = (event) => {
    event.stopPropagation();
    preventCollapsibleToggle();
    // TODO
  };

  const handleStepAddBellowClick: VscodeIconMouseEventHandler = (event) => {
    event.stopPropagation();
    preventCollapsibleToggle();
    // TODO
  };

  const handleStepAddAboveClick: VscodeIconMouseEventHandler = (event) => {
    event.stopPropagation();
    preventCollapsibleToggle();
    // TODO
  };

  const handleStepDisableClick: VscodeIconMouseEventHandler = (event) => {
    event.stopPropagation();
    preventCollapsibleToggle();
    dispatch({
      type: "SET_STEP_ENABLED",
      payload: {
        index,
        enabled: !step.enabled,
      }
    });
  };

  const handleStepRemoveClick: VscodeIconMouseEventHandler = (event) => {
    event.stopPropagation();
    preventCollapsibleToggle();
    // TODO
  };

  return (
    <>
      <VscodeIcon
        id={`step${index}ActionAddStepRename`}
        action-icon
        aria-role="button"
        slot="decorations"
        name="edit"
        label={t("rename")}
        title={t("rename")}
        onClick={handleStepActionRenameClick}></VscodeIcon>
      {state.steps.length > 1 && (
        <>
          {index + 1 < state.steps.length ? (
            <VscodeIcon
              id={`step${index}ActionAddStepMoveDown`}
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
              id={`step${index}ActionAddStepMoveUp`}
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
        id={`step${index}ActionAddStepBellow`}
        action-icon
        aria-role="button"
        slot="decorations"
        name="debug-step-into"
        label={t("add step bellow")}
        title={t("add step bellow")}
        onClick={handleStepAddBellowClick}></VscodeIcon>
      <VscodeIcon
        id={`step${index}ActionAddStepAbove`}
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
            id={`step${index}ActionDisable`}
            action-icon
            aria-role="button"
            slot="decorations"
            name="circle-slash"
            label={t("disable")}
            title={t("disable")}
            onClick={handleStepDisableClick}
            aria-pressed={!step.enabled}></VscodeIcon>
          <VscodeIcon
            id={`step${index}ActionRemove`}
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

export default Actions;