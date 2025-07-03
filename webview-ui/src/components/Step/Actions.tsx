import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { VscodeIcon, VscodeContextMenu } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import {
  Refs,
  VscodeIconRefObject,
  CreateHandler,
  Handlers,
  StepActionIcon,
  UseClickEventListenerArgs,
} from "../../types/events";

function useClickEventListener(
  ref: UseClickEventListenerArgs[0],
  handler: UseClickEventListenerArgs[1]
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [ref, handler]);
}

const Actions: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const [confirmRemoval, setConfirmRemoval] = useState(false);

  const step = state.steps[index];
  const length = state.steps.length;

  const iconRefs: Refs<VscodeIconRefObject> = {
    rename: useRef(null),
    moveDown: useRef(null),
    moveUp: useRef(null),
    addBelow: useRef(null),
    addAbove: useRef(null),
    disable: useRef(null),
    remove: useRef(null),
  };

  const buttonRefs: Refs<HTMLButtonElement> = {
    cancelRemoval: useRef(null),
    confirmRemoval: useRef(null),
  };

  const createHandler: CreateHandler = (fn) =>
    useCallback(
      (event) => {
        event.stopPropagation();
        fn?.();
      },
      [fn]
    );

  const handlers: Handlers = {
    rename: createHandler(() => {
      // TODO
    }),
    moveDown: createHandler(() => {
      dispatch({
        type: "SET_STEP_POSITION",
        payload: {
          index,
          position: index + 1,
        },
      });
    }),
    moveUp: createHandler(() => {
      dispatch({
        type: "SET_STEP_POSITION",
        payload: {
          index,
          position: index - 1,
        },
      });
    }),
    addBelow: createHandler(() => {
      dispatch({
        type: "ADD_STEP",
        payload: {
          index,
          position: index + 1,
        },
      });
    }),
    addAbove: createHandler(() => {
      dispatch({
        type: "ADD_STEP",
        payload: {
          index,
          position: index,
        },
      });
    }),
    disable: createHandler(() => {
      dispatch({
        type: "SET_STEP_ENABLED",
        payload: {
          index,
          enabled: !step.enabled,
        },
      });
    }),
    remove: createHandler(() => {
      setConfirmRemoval(true);
      buttonRefs?.confirmRemoval?.current?.focus();
    }),
    cancelRemoval: createHandler(() => {
      setConfirmRemoval(false);
    }),
    confirmRemoval: createHandler(() => {
      dispatch({
        type: "REMOVE_STEP",
        payload: {
          index,
        },
      });
    }),
  };

  Object.entries(iconRefs).forEach(([key, ref]) => {
    useClickEventListener(ref, handlers[key as keyof typeof handlers]);
  });

  Object.entries(buttonRefs).forEach(([key, ref]) => {
    useClickEventListener(ref, handlers[key as keyof typeof handlers]);
  });

  const icons: StepActionIcon[] = [
    {
      key: "rename",
      label: t("rename"),
      icon: "edit",
      visible: true,
    },
    {
      key: "moveDown",
      label: t("move down"),
      icon: "arrow-down",
      visible: index + 1 < length,
    },
    {
      key: "moveUp",
      label: t("move up"),
      icon: "arrow-up",
      visible: index > 0,
    },
    {
      key: "addBelow",
      label: t("add step below"),
      icon: "debug-step-into",
      visible: true,
    },
    {
      key: "addAbove",
      label: t("add step above"),
      icon: "debug-step-out",
      visible: true,
    },
    {
      key: "disable",
      label: t("disable"),
      icon: "circle-slash",
      visible: true,
      ariaPressed: !step.enabled,
    },
    {
      key: "remove",
      label: t("remove"),
      icon: "trash",
      visible: length > 1,
    },
  ];

  const slot = "decorations"; // 'actions' or 'decorations'

  return confirmRemoval ? (
    <div role="alertdialog" slot={slot} className="helper-text">
      {t("Remove this step?")}
      &emsp;
      <button ref={buttonRefs.confirmRemoval} className="button-link-helper">
        {t("Yes")}
      </button>
      &emsp;
      <button ref={buttonRefs.cancelRemoval} className="button-link-helper">
        {t("No")}
      </button>
    </div>
  ) : (
    <>
      <div className="stepActionIcons" slot={slot}>
        {icons.map(({ key, label, title, icon, visible, ariaPressed }) =>
          visible ? (
            <VscodeIcon
              key={key}
              id={`iconStep${index}Action${key}`}
              ref={iconRefs[key]}
              action-icon
              role="button"
              name={icon}
              label={label}
              title={title ?? label}
              aria-pressed={ariaPressed}
            />
          ) : length > 2 ? (
            <VscodeIcon key={key} action-icon role="presentation" name="blank" />
          ) : (
            <Fragment key={key} />
          )
        )}
      </div>
      <div className="stepActionsMenu" slot={slot} title={t("Widen this panel to see options")}>
        …
      </div>
    </>
  );
};

export default Actions;
