import type { MutableRefObject, RefObject } from "react";
import type { VscodeIconClickEventListener } from "./event-handlers";
import { VscodeIcon as VscodeIconConstructor } from "@vscode-elements/elements/dist/vscode-icon/vscode-icon";

export type UseIconClickEventListener = (
  ref: RefObject<VscodeIconConstructor>,
  handler: VscodeIconClickEventListener
) => void;

type UseIconClickEventListenerArgs = Parameters<UseIconClickEventListener>;

export type StepAction =
  | "rename"
  | "moveDown"
  | "moveUp"
  | "addBelow"
  | "addAbove"
  | "disable"
  | "remove";

export type VscodeIconRefObject = VscodeIconConstructor | null;

export type Refs = Record<StepAction, MutableRefObject<VscodeIconRefObject>>;

export type CreateHandler = (fn?: () => void) => VscodeIconClickEventListener;

export type Handlers = Record<StepAction, VscodeIconClickEventListener>;

export type IconConfig = {
  key: StepAction;
  label: string;
  title?: string;
  icon: string;
  visible: boolean;
  ariaPressed?: boolean;
};
