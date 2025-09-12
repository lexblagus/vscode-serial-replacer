import { useEffect, useRef, useState } from "react";
import {
  VscodeCollapsible,
  VscodeFormGroup,
  VscodeFormHelper,
  VscodeLabel,
  VscodeTextarea,
} from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import Actions from "./Actions";
import FindActions from "./FindActions";
import ReplaceActions from "./ReplaceActions";
import { useAppContext } from "../../context";
import { text } from "../../utils/etc";
import prefs from "../../config.json";

import type { VscodeCollapsible as VscodeCollapsibleConstructor } from "@vscode-elements/elements/dist/vscode-collapsible/vscode-collapsible";
import type { VscodeTextarea as VscodeTextareaConstructor } from "@vscode-elements/elements/dist/vscode-textarea/vscode-textarea";
import type { Dispatch, FC, RefObject } from "react";
import type {
  TextareaKeyboardEventHandler,
  TextfieldChangeEventHandler,
  TextfieldKeyboardEventHandler,
  VscodeCollapsibleToggleEventHandler,
} from "../../types/events";
import type { AppAction } from "../../types/actions";

import "./Step.css";

function useDebouncedDispatch(
  ref: RefObject<VscodeTextareaConstructor>,
  type: "SET_STEP_FIND" | "SET_STEP_REPLACE",
  dispatch: Dispatch<AppAction>,
  index: number,
  delay = prefs.debounceDelay,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log("○ debounce callback");
      if(type === 'SET_STEP_FIND'){
        dispatch({
          type,
          payload: {
            index,
            find: {
              content: ref.current?.value ?? '',
            },
          },
        });
      }
      if(type === 'SET_STEP_REPLACE'){
        dispatch({
          type,
          payload: {
            index,
            replace: {
              content: ref.current?.value ?? '',
            },
          },
        });
      }
    }, delay);
  };
}

const Step: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const [findErrorMessage, setFindErrorMessage] = useState<string | null>(null);
  const collapsibleRef = useRef<VscodeCollapsibleConstructor | null>(null);
  const textareaFindRef = useRef<VscodeTextareaConstructor | null>(null);
  const textareaReplaceRef = useRef<VscodeTextareaConstructor | null>(null);

  const debouncedFind = useDebouncedDispatch(
    textareaFindRef,
    "SET_STEP_FIND",
    dispatch,
    index,
  );
  const debouncedReplace = useDebouncedDispatch(
    textareaReplaceRef,
    "SET_STEP_REPLACE",
    dispatch,
    index,
  );

  const step = state.steps[index];
  const title = step.title || t("Step {0}", (index + 1).toString());

  const CollapsibleToggleEventHandler: VscodeCollapsibleToggleEventHandler = (event) => {
    console.log("▷ CollapsibleToggleEventHandler");

    dispatch({
      type: "SET_STEP_EXPANDED",
      payload: {
        index,
        expanded: event.detail.open,
      },
    });
  };

  const handleStepFindChange: TextfieldChangeEventHandler = (event) => debouncedFind();

  const handleStepFindKeyUp: TextareaKeyboardEventHandler = (event) => debouncedFind();

  const handleStepFindKeyDown: TextareaKeyboardEventHandler = (event) => {
    console.log("▷ handleStepFindKeyDown");

    // TODO: arrow history
  };

  const handleStepReplaceChange: TextfieldChangeEventHandler = (event) => debouncedReplace();

  const handleStepReplaceKeyUp: TextareaKeyboardEventHandler = (event) => debouncedReplace();

  const handleStepReplaceKeyDown: TextareaKeyboardEventHandler = (event) => {
    console.log("▷ handleStepReplaceKeyDown");

    // TODO: arrow history
  };

  useEffect(() => {
    const currentElement = collapsibleRef.current;
    if (!currentElement) return;

    currentElement.addEventListener("vsc-collapsible-toggle", CollapsibleToggleEventHandler);

    return () => {
      currentElement.removeEventListener("vsc-collapsible-toggle", CollapsibleToggleEventHandler);
    };
  }, [collapsibleRef, CollapsibleToggleEventHandler]);

  useEffect(() => {
    const el = textareaFindRef.current;
    if (!el) return;

    el.wrappedElement.setAttribute("wrap", step.find.wordWrap ? "soft" : "off");
  }, [step]);

  useEffect(() => {
    const el = textareaReplaceRef.current;
    if (!el) return;

    el.wrappedElement.setAttribute("wrap", step.replace.wordWrap ? "soft" : "off");
  }, [step]);

  useEffect(() => {
    try {
      if (step.find.regExp) {
        new RegExp(
          step.find.content,
          ["g", !step.find.caseSensitive && "i", "m"].filter(Boolean).join("")
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setFindErrorMessage(err.message);
        return;
      }
      setFindErrorMessage(`${err}`);
      return;
    }

    setFindErrorMessage(null);
  }, [step.find]);

  return (
    <div className="thin-bottom-margin">
      <VscodeCollapsible
        style={{
          opacity: step.enabled ? 1 : 0.5,
        }}
        title={title}
        description={!step.enabled ? `(${t("disabled")})` : undefined}
        ref={collapsibleRef}
        open={step.expanded}>
        <Actions index={index} />
        <div className="stepInnerWrapper">
          <VscodeFormGroup variant="vertical" className="no-y-margin">
            <div className="labelAndActions">
              <div className="label">
                <VscodeLabel htmlFor={`step${index}FindContent`} className="text-discreet">
                  {t("find")}
                </VscodeLabel>
              </div>
              <div className="actions">
                <FindActions index={index} />
              </div>
            </div>
            <VscodeTextarea
              id={`step${index}FindContent`}
              ref={textareaFindRef}
              className="textarea-full"
              label={t("Find")}
              placeholder={t("{0} for history", text["arrow-up-and-down"])}
              resize="vertical"
              value={step.find.content}
              invalid={findErrorMessage !== null}
              onChange={handleStepFindChange}
              onKeyDown={handleStepFindKeyDown}
              onKeyUp={handleStepFindKeyUp}></VscodeTextarea>
            {findErrorMessage && (
              <VscodeFormHelper className="error-message">{findErrorMessage}</VscodeFormHelper>
            )}
          </VscodeFormGroup>

          <VscodeFormGroup variant="vertical" className="no-y-margin">
            <div className="labelAndActions">
              <div className="label">
                <VscodeLabel htmlFor={`step${index}ReplaceContent`} className="text-discreet">
                  {t("replace")}
                </VscodeLabel>
              </div>
              <div className="actions">
                <ReplaceActions index={index} />
              </div>
            </div>
            <VscodeTextarea
              id={`step${index}ReplaceContent`}
              ref={textareaReplaceRef}
              className="textarea-full"
              title={t("Replace")}
              label={t("replace")}
              placeholder={t("{0} for history", text["arrow-up-and-down"])}
              resize="vertical"
              value={step.replace.content}
              onChange={handleStepReplaceChange}
              onKeyDown={handleStepReplaceKeyDown}
              onKeyUp={handleStepReplaceKeyUp}></VscodeTextarea>
          </VscodeFormGroup>
        </div>
      </VscodeCollapsible>
    </div>
  );
};

export default Step;
