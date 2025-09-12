import type {
  KeyboardEventHandler,
  MouseEventHandler,
  MutableRefObject,
  RefObject,
  VscCollapsibleToggleEvent,
  VscodeTreeActionEvent,
  VscodeTreeSelectEvent,
  VscodeTree,
  VscodeIconConstructor,
  VscodeTextfieldConstructor,
  VscodeTextareaConstructor,
  VscodeButtonConstructor,
} from "./dependencies";

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
export type VscodeButtonMouseEventHandler = MouseEventHandler<VscodeButtonConstructor>;
export type VscodeIconMouseEventHandler = MouseEventHandler<VscodeIconConstructor>;
export type VscTreeActionMouseEventHandler = (ev: VscodeTreeActionEvent) => void;
export type VscTreeSelectMouseEventHandler = (ev: VscodeTreeSelectEvent) => void;
export type VscTreeMouseEventHandler = MouseEventHandler<VscodeTree>;
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
