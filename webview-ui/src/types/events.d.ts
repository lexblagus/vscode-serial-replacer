import { KeyboardEventHandler, MouseEventHandler, MutableRefObject, RefObject } from "react";
import type { VscCollapsibleToggleEvent } from "@vscode-elements/elements/dist/vscode-collapsible/vscode-collapsible";
import type { VscTreeActionEvent } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";
import type { VscodeIcon as VscodeIconConstructor } from "@vscode-elements/elements/dist/vscode-icon/vscode-icon";
import type { VscodeTextfield as VscodeTextfieldConstructor } from "@vscode-elements/elements/dist/vscode-textfield/vscode-textfield";
import type { VscodeTextarea as VscodeTextareaConstructor } from "@vscode-elements/elements/dist/vscode-textarea/vscode-textarea";
import type { VscodeButton as VscodeButtonConstructor } from "@vscode-elements/elements/dist/vscode-button/vscode-button";

// Actions

export type StepActions =
  | "rename"
  | "moveDown"
  | "moveUp"
  | "addBelow"
  | "addAbove"
  | "disable"
  | "remove"
  | "cancelRemoval"
  | "confirmRemoval";

// Handlers

export type LinkMouseEventHandler = MouseEventHandler<HTMLAnchorElement>;
export type TextfieldChangeEventHandler = (ev: Event) => void;
export type TextareaChangeEventHandler = (ev: Event) => void;
export type TextfieldKeyboardEventHandler = KeyboardEventHandler<VscodeTextfieldConstructor>;
export type TextareaKeyboardEventHandler = KeyboardEventHandler<VscodeTextareaConstructor>;
export type VscodeButtonMouseEventHandler = MouseEventHandler<VscodeButton>;
export type VscodeIconMouseEventHandler = MouseEventHandler<VscodeIconConstructor>;
export type VscTreeActionMouseEventHandler = (ev: VscTreeActionEvent) => void;
export type VscTreeSelectMouseEventHandler = (ev: VscTreeSelectEvent) => void;
export type VscodeCollapsibleToggleEventHandler = (
  this: HTMLElement,
  ev: VscCollapsibleToggleEvent
) => void;

export type CreateHandler = (fn?: () => void) => EventListenerOrEventListenerObject;
export type Handlers = Record<StepActions, EventListenerOrEventListenerObject>;

// Listeners

export type UseClickEventListener = (
  ref: RefObject<VscodeIconConstructor | VscodeButtonConstructor | HTMLButtonElement>,
  handler: EventListenerOrEventListenerObject
) => void;

export type UseClickEventListenerArgs = Parameters<UseClickEventListener>;

// References

export type Refs<T> = Partial<Record<StepActions, MutableRefObject<T | null>>>;
export type VscodeIconRefObject = VscodeIconConstructor | null;

// Etc

export type StepActionIcon = {
  key: StepActions;
  label: string;
  title?: string;
  icon: string;
  visible: boolean;
  ariaPressed?: boolean;
};
