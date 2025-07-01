import { KeyboardEventHandler, MouseEventHandler } from "react";
import type {
  VscodeIcon,
  VscodeTextfield,
} from "@vscode-elements/elements/dist/vscode-icon/vscode-icon";
import type { VscCollapsibleToggleEvent, VscodeCollapsible as VscodeCollapsibleConstructor } from "@vscode-elements/elements/dist/vscode-collapsible/vscode-collapsible";

export type TextfieldChangeEventHandler = (ev: Event) => void;
export type TextareaChangeEventHandler = (ev: Event) => void;
export type TextfieldKeyboardEventHandler = KeyboardEventHandler<VscodeTextfield>;

export type VscodeIconMouseEventHandler = MouseEventHandler<VscodeIcon>;
export type VscodeIconClickEventListener = (this: HTMLElement, ev: MouseEvent) => void
export type VscodeButtonMouseEventHandler = MouseEventHandler<VscodeButton>;
export type LinkMouseEventHandler = MouseEventHandler<HTMLAnchorElement>;

export type VscTreeActionMouseEventHandler = (ev: VscTreeActionEvent) => void;

export type VscodeCollapsibleToggleEventHandler = (this: HTMLElement, ev: VscCollapsibleToggleEvent) => void