import { useCallback, useEffect, useRef } from "react";
import type { FC } from "react";
import { VscodeIcon } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import {
  Refs,
  VscodeIconRefObject,
  CreateHandler,
  Handlers,
  IconConfig,
  UseIconClickEventListenerArgs,
} from "../../types/step-actions";

function useIconClickEventListener(
  ref: UseIconClickEventListenerArgs[0],
  handler: UseIconClickEventListenerArgs[1]
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

  const step = state.steps[index];

  const refs: Refs = {
    rename: useRef<VscodeIconRefObject>(null),
    moveDown: useRef<VscodeIconRefObject>(null),
    moveUp: useRef<VscodeIconRefObject>(null),
    addBelow: useRef<VscodeIconRefObject>(null),
    addAbove: useRef<VscodeIconRefObject>(null),
    disable: useRef<VscodeIconRefObject>(null),
    remove: useRef<VscodeIconRefObject>(null),
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
      // TODO
    }),
    moveUp: createHandler(() => {
      // TODO
    }),
    addBelow: createHandler(() => {
      // TODO
    }),
    addAbove: createHandler(() => {
      // TODO
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
      // TODO
    }),
  };

  Object.entries(refs).forEach(([key, ref]) => {
    useIconClickEventListener(ref, handlers[key as keyof typeof handlers]);
  });

  const icons: IconConfig[] = [
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
      visible: index + 1 < state.steps.length,
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
      visible: state.steps.length > 1,
      ariaPressed: !step.enabled,
    },
    {
      key: "remove",
      label: t("disable"),
      icon: "trash",
      visible: state.steps.length > 1,
    },
  ];

  const slot = "decorations"; // 'actions' or 'decorations'

  return (
    <>
      {icons.map(({ key, label, title, icon, visible, ariaPressed }) =>
        visible ? (
          <VscodeIcon
            key={key}
            id={`iconStep${index}Action${key}`}
            ref={refs[key]}
            action-icon
            slot={slot}
            role="button"
            name={icon}
            label={label}
            title={title ?? label}
            aria-pressed={ariaPressed}
          />
        ) : (
          <VscodeIcon
            key={`${key}-blank`}
            action-icon
            role="presentation"
            slot={slot}
            name="blank"
          />
        )
      )}
    </>
  );
};

export default Actions;
