import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import {
  VscodeCollapsible,
  VscodeFormGroup,
  VscodeFormHelper,
  VscodeLabel,
  VscodeTextarea,
} from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../../context";
import content from "../../utils/content";
import type {
  LinkMouseEventHandler,
  TextareaChangeEventHandler,
  TextareaKeyboardEventHandler,
  VscodeCollapsibleToggleEventHandler,
} from "../../types/events";
import "./Step.css";
import Actions from "./Actions";
import FindActions from "./FindActions";
import ReplaceActions from "./ReplaceActions";
import type { VscodeCollapsible as VscodeCollapsibleConstructor } from "@vscode-elements/elements/dist/vscode-collapsible/vscode-collapsible";
import type { VscodeTextarea as VscodeTextareaConstructor } from "@vscode-elements/elements/dist/vscode-textarea/vscode-textarea";

const Step: FC<{ index: number }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const [findErrorMessage, setFindErrorMessage] = useState<string | null>(null);
  const collapsibleRef = useRef<VscodeCollapsibleConstructor | null>(null);
  const textareaFindRef = useRef<VscodeTextareaConstructor | null>(null);
  const textareaReplaceRef = useRef<VscodeTextareaConstructor | null>(null);
  const step = state.steps[index];
  const title = step.title ?? t("Step {0}", (index + 1).toString());

  const CollapsibleToggleEventHandler: VscodeCollapsibleToggleEventHandler = (event) => {
    dispatch({
      type: "SET_STEP_EXPANDED",
      payload: {
        index,
        expanded: event.detail.open,
      },
    });
  };

  const handleStepFindChange: TextareaChangeEventHandler = (event) => {
    dispatch({
      type: "SET_STEP_FIND",
      payload: {
        index,
        find: {
          content: (event.target as HTMLInputElement).value,
        },
      },
    });
  };

  const handleStepFindKeyDown: TextareaKeyboardEventHandler = (event) => {
    // TODO: arrow history
  };

  const handleStepFindKeyUp: TextareaKeyboardEventHandler = (event) => {
    dispatch({
      type: "SET_STEP_FIND",
      payload: {
        index,
        find: {
          content: (event.target as HTMLInputElement).value,
        },
      },
    });
  };

  const handleStepReplaceChange: TextareaChangeEventHandler = (event) => {
    dispatch({
      type: "SET_STEP_REPLACE",
      payload: {
        index,
        replace: {
          content: (event.target as HTMLInputElement).value,
        },
      },
    });
  };

  const handleStepReplaceKeyDown: TextareaKeyboardEventHandler = (event) => {
    // TODO: arrow history
  };

  const handleStepReplacePreviewClick: LinkMouseEventHandler = (event) => {
    // TODO
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
          [step.find.global && "g", !step.find.caseSensitive && "i", step.find.multiline && "m"]
            .filter(Boolean)
            .join("")
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
          opacity: step.enabled ? 1 : 0.5
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
              placeholder={t("{0} for history", content["arrow-up-and-down"])}
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
              placeholder={t("{0} for history", content["arrow-up-and-down"])}
              resize="vertical"
              value={step.replace.content}
              onChange={handleStepReplaceChange}
              onKeyDown={handleStepReplaceKeyDown}></VscodeTextarea>
          </VscodeFormGroup>
          <div className="x-end text-discreet">
            <a href="#" onClick={handleStepReplacePreviewClick}>
              {t("preview…")}
            </a>
          </div>
          <br />
        </div>
      </VscodeCollapsible>
    </div>
  );
};

export default Step;
