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
import { debounce, detectNavigationDirection, setHistoricField, text } from "../../utils/etc";
import { vscode } from "../../utils/vscode";
import config from "../../config.json";

import type { FC } from "react";
import type { VscodeCollapsibleToggleEventHandler } from "../../types/events";
import type {
  VscodeCollapsibleConstructor,
  VscodeTextareaConstructor,
} from "../../types/dependencies";

import "./Step.css";

const Step: FC<{ index: number }> = ({ index }) => {
  const {
    state: { loaded },
    dispatch,
  } = useAppContext();
  const [findErrorMessage, setFindErrorMessage] = useState<string | null>(null);
  const collapsibleRef = useRef<VscodeCollapsibleConstructor>(null);
  const textareaFindRef = useRef<VscodeTextareaConstructor>(null);
  const textareaReplaceRef = useRef<VscodeTextareaConstructor>(null);

  const step = loaded.steps[index];
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

  useEffect(() => {
    // Find textfield handlers
    const textfield = textareaFindRef.current;
    if (!textfield) {
      return;
    }

    const handleChange = (event: KeyboardEvent) => {
      console.log("○ handleChange");
      setHistoricField({ dispatch, field: "findContent", value: textfield.value, index });
    };

    const handleKeyUp = debounce((event: KeyboardEvent) => {
      console.log("○ handleKeyUp");
      setHistoricField({ dispatch, field: "findContent", value: textfield.value, index });
    }, config.debounceDelay);

    const handleKeyDown = debounce((event: KeyboardEvent) => {
      console.log("○ handleKeyDown");
      const direction = detectNavigationDirection(event.key, textfield);
      console.log("direction", direction);
      if (direction) {
        // TODO: retrieve history
        // ...
      }
    }, config.debounceDelay);

    textfield.addEventListener("keydown", handleKeyDown);
    textfield.addEventListener("keyup", handleKeyUp);
    textfield.addEventListener("change", handleChange);

    return () => {
      textfield.removeEventListener("keydown", handleKeyDown);
      textfield.removeEventListener("keyup", handleKeyUp);
      textfield.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    // Replace textfield handlers
    const textfield = textareaReplaceRef.current;
    if (!textfield) {
      return;
    }

    const handleChange = (event: KeyboardEvent) => {
      console.log("○ handleChange");
      setHistoricField({ dispatch, field: "replaceContent", value: textfield.value, index });
    };

    const handleKeyUp = debounce((event: KeyboardEvent) => {
      console.log("○ handleKeyUp");
      setHistoricField({ dispatch, field: "replaceContent", value: textfield.value, index });
    }, config.debounceDelay);

    const handleKeyDown = debounce((event: KeyboardEvent) => {
      console.log("○ handleKeyDown");
      const direction = detectNavigationDirection(event.key, textfield);
      console.log("direction", direction);
      if (direction) {
        // TODO: retrieve history
        // ...
      }
    }, config.debounceDelay);

    textfield.addEventListener("keydown", handleKeyDown);
    textfield.addEventListener("keyup", handleKeyUp);
    textfield.addEventListener("change", handleChange);

    return () => {
      textfield.removeEventListener("keydown", handleKeyDown);
      textfield.removeEventListener("keyup", handleKeyUp);
      textfield.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    // Expand/collapse toggle
    const currentElement = collapsibleRef.current;
    if (!currentElement) {
      return;
    }

    currentElement.addEventListener("vsc-collapsible-toggle", CollapsibleToggleEventHandler);

    return () => {
      currentElement.removeEventListener("vsc-collapsible-toggle", CollapsibleToggleEventHandler);
    };
  }, [collapsibleRef, CollapsibleToggleEventHandler]);

  useEffect(() => {
    // Find event listeners
    const el = textareaFindRef.current;
    if (!el) {
      return;
    }

    el.wrappedElement.setAttribute("wrap", step.find.wordWrap ? "soft" : "off");
  }, [step]);

  useEffect(() => {
    // Replace event listeners
    const el = textareaReplaceRef.current;
    if (!el) {
      return;
    }

    el.wrappedElement.setAttribute("wrap", step.replace.wordWrap ? "soft" : "off");
  }, [step]);

  useEffect(() => {
    // Evaluate regular expression
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
              invalid={findErrorMessage !== null}></VscodeTextarea>
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
              value={step.replace.content}></VscodeTextarea>
          </VscodeFormGroup>
        </div>
      </VscodeCollapsible>
    </div>
  );
};

export default Step;
