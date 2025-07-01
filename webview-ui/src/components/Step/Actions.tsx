import { useCallback, useEffect, useRef } from "react";
import type { FC } from "react";
import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import type { VscodeIconMouseEventHandler, VscodeIconClickEventListener } from "../../types";
import type { VscodeIcon as VscodeIconConstructor } from "@vscode-elements/elements/dist/vscode-icon/vscode-icon";

const Actions: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();

  const step = state.steps[index];

  const iconStepActionRenameRef = useRef<VscodeIconConstructor | null>(null);
  const iconStepActionMoveDownRef = useRef<VscodeIconConstructor | null>(null);
  const iconStepActionMoveUpRef = useRef<VscodeIconConstructor | null>(null);
  const iconStepActionAddBelowRef = useRef<VscodeIconConstructor | null>(null);
  const iconStepActionAddAboveRef = useRef<VscodeIconConstructor | null>(null);
  const iconStepActionDisableRef = useRef<VscodeIconConstructor | null>(null);
  const iconStepActionRemoveRef = useRef<VscodeIconConstructor | null>(null);

  const handleStepActionRenameClick: VscodeIconClickEventListener = useCallback(
    (event) => {
      event.stopPropagation();
      // TODO
    },
    [index, dispatch, step]
  );

  const handleStepActionMoveDownClick: VscodeIconClickEventListener = useCallback(
    (event) => {
      event.stopPropagation();
      // TODO
    },
    [index, dispatch, step]
  );

  const handleStepActionMoveUpClick: VscodeIconClickEventListener = useCallback(
    (event) => {
      event.stopPropagation();
      // TODO
    },
    [index, dispatch, step]
  );

  const handleStepActionAddBelowClick: VscodeIconClickEventListener = useCallback(
    (event) => {
      event.stopPropagation();
      // TODO
    },
    [index, dispatch, step]
  );

  const handleStepActionAddAboveClick: VscodeIconClickEventListener = useCallback(
    (event) => {
      event.stopPropagation();
      // TODO
    },
    [index, dispatch, step]
  );

  const handleStepActionDisableClick: VscodeIconClickEventListener = useCallback(
    (event) => {
      event.stopPropagation();
      dispatch({
        type: "SET_STEP_ENABLED",
        payload: {
          index,
          enabled: !step.enabled,
        },
      });
    },
    [index, dispatch, step]
  );

  const handleStepActionRemoveClick: VscodeIconClickEventListener = useCallback(
    (event) => {
      event.stopPropagation();
      // TODO
    },
    [index, dispatch, step]
  );

  useEffect(() => {
    const currentElement = iconStepActionRenameRef.current;
    if (!currentElement) return;

    currentElement.addEventListener("click", handleStepActionRenameClick);
    return () => {
      currentElement.removeEventListener("click", handleStepActionRenameClick);
    };
  }, [handleStepActionRenameClick]);

  useEffect(() => {
    const currentElement = iconStepActionMoveDownRef.current;
    if (!currentElement) return;

    currentElement.addEventListener("click", handleStepActionMoveDownClick);
    return () => {
      currentElement.removeEventListener("click", handleStepActionMoveDownClick);
    };
  }, [handleStepActionMoveDownClick]);

  useEffect(() => {
    const currentElement = iconStepActionMoveUpRef.current;
    if (!currentElement) return;

    currentElement.addEventListener("click", handleStepActionMoveUpClick);
    return () => {
      currentElement.removeEventListener("click", handleStepActionMoveUpClick);
    };
  }, [handleStepActionMoveUpClick]);

  useEffect(() => {
    const currentElement = iconStepActionAddBelowRef.current;
    if (!currentElement) return;

    currentElement.addEventListener("click", handleStepActionAddBelowClick);
    return () => {
      currentElement.removeEventListener("click", handleStepActionAddBelowClick);
    };
  }, [handleStepActionAddBelowClick]);

  useEffect(() => {
    const currentElement = iconStepActionAddAboveRef.current;
    if (!currentElement) return;

    currentElement.addEventListener("click", handleStepActionAddAboveClick);
    return () => {
      currentElement.removeEventListener("click", handleStepActionAddAboveClick);
    };
  }, [handleStepActionAddAboveClick]);

  useEffect(() => {
    const currentElement = iconStepActionDisableRef.current;
    if (!currentElement) return;

    currentElement.addEventListener("click", handleStepActionDisableClick);
    return () => {
      currentElement.removeEventListener("click", handleStepActionDisableClick);
    };
  }, [handleStepActionDisableClick]);

  useEffect(() => {
    const currentElement = iconStepActionRemoveRef.current;
    if (!currentElement) return;

    currentElement.addEventListener("click", handleStepActionRemoveClick);
    return () => {
      currentElement.removeEventListener("click", handleStepActionRemoveClick);
    };
  }, [handleStepActionRemoveClick]);

  const slot = "decorations"; // 'actions' or 'decorations'

  return (
    <>
      <VscodeIcon
        id={`iconStep${index}ActionRename`}
        ref={iconStepActionRenameRef}
        action-icon
        aria-role="button"
        slot={slot}
        name="edit"
        label={t("rename")}
        title={t("rename")}></VscodeIcon>
      {state.steps.length > 1 && (
        <>
          {index + 1 < state.steps.length ? (
            <VscodeIcon
              id={`iconStep${index}ActionMoveDown`}
              ref={iconStepActionMoveDownRef}
              action-icon
              aria-role="button"
              slot={slot}
              name="arrow-down"
              label={t("move down")}
              title={t("move down")}></VscodeIcon>
          ) : (
            <VscodeIcon action-icon aria-role="presentation" slot={slot} name="blank"></VscodeIcon>
          )}
          {index > 0 ? (
            <VscodeIcon
              id={`iconStep${index}ActionMoveUp`}
              ref={iconStepActionMoveUpRef}
              action-icon
              aria-role="button"
              slot={slot}
              name="arrow-up"
              label={t("move up")}
              title={t("move up")}></VscodeIcon>
          ) : (
            <VscodeIcon action-icon aria-role="presentation" slot={slot} name="blank"></VscodeIcon>
          )}
        </>
      )}
      <VscodeIcon
        id={`iconStep${index}ActionAddBelow`}
        ref={iconStepActionAddBelowRef}
        action-icon
        aria-role="button"
        slot={slot}
        name="debug-step-into"
        label={t("add step below")}
        title={t("add step below")}></VscodeIcon>
      <VscodeIcon
        id={`iconStep${index}ActionAddAbove`}
        ref={iconStepActionAddAboveRef}
        action-icon
        aria-role="button"
        slot={slot}
        name="debug-step-out"
        label={t("add step above")}
        title={t("add step above")}></VscodeIcon>
      {state.steps.length > 1 && (
        <>
          <VscodeIcon
            id={`iconStep${index}ActionDisable`}
            ref={iconStepActionDisableRef}
            action-icon
            aria-role="button"
            slot={slot}
            name="circle-slash"
            label={t("disable")}
            title={t("disable")}
            aria-pressed={step.enabled === false}></VscodeIcon>
          <VscodeIcon
            id={`iconStep${index}ActionRemove`}
            ref={iconStepActionRemoveRef}
            action-icon
            aria-role="button"
            slot={slot}
            name="trash"
            label={t("remove")}
            title={t("remove")}></VscodeIcon>
        </>
      )}
    </>
  );
};

export default Actions;
