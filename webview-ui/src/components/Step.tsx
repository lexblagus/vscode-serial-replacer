import type { FC } from "react";
import {
  VscodeCollapsible, VscodeFormGroup, VscodeLabel,
  VscodeTextarea
} from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import content from "../utils/content";
import type { LinkMouseEventHandler, TextareaChangeEventHandler, TextfieldKeyboardEventHandler } from "../types";
import "./Step.css";
import { StepActions, StepFindActions, StepReplaceActions } from "./StepActions";

const Step: FC<{index: number; }> = ({ index }) => {
  const { state, dispatch } = useAppContext();
  const step = state.steps[index];

  const handleStepFindChange: TextareaChangeEventHandler = (event) => {
    dispatch({
      type: "SET_STEP_FIND",
      payload: {
        index,
        find: {
          content: (event.target as HTMLInputElement).value
        }
      },
    });
  };

  const handleStepReplaceChange: TextareaChangeEventHandler = (event) => {
    dispatch({
      type: "SET_STEP_REPLACE",
      payload: {
        index,
        replace: {
          content: (event.target as HTMLInputElement).value
        }
      },
    });
  };

  const handleStepReplacePreviewClick: LinkMouseEventHandler = (event) => {
    // TODO
  };

  const handleStepFindKeyDown: TextfieldKeyboardEventHandler = (event) => {
    // TODO
  };

  const handleStepReplaceKeyDown: TextfieldKeyboardEventHandler = (event) => {
    // TODO
  };

  return (
    <div className="thin-bottom-margin">
      <VscodeCollapsible title={step.title} open={state.steps.length === 1 || step.expanded}>
        <StepActions index={index} />
        <div className="stepInnerWrapper">
          <VscodeFormGroup variant="vertical" className="no-y-margin">
            <div className="labelAndActions">
              <div className="label">
                <VscodeLabel htmlFor={`step${index}FindContent`} className="text-discreet">
                  {t("find")}
                </VscodeLabel>
              </div>
              <div className="actions">
                <StepFindActions index={index} />
              </div>
            </div>
            <VscodeTextarea
              id={`step${index}FindContent`}
              className="textarea-full"
              title={t("Find")}
              label={t("Find")}
              placeholder={t("{0} for history", content["arrow-up-and-down"])}
              rows={5}
              resize="vertical"
              value={step.find.content}
              onChange={handleStepFindChange}
              onKeyDown={handleStepFindKeyDown}></VscodeTextarea>
          </VscodeFormGroup>

          <VscodeFormGroup variant="vertical" className="no-y-margin">
            <div className="labelAndActions">
              <div className="label">
                <VscodeLabel htmlFor={`step${index}ReplaceContent`} className="text-discreet">
                  {t("replace")}
                </VscodeLabel>
              </div>
              <div className="actions">
                <StepReplaceActions index={index} />
              </div>
            </div>
            <VscodeTextarea
              id={`step${index}ReplaceContent`}
              className="textarea-full"
              title={t("Replace")}
              label={t("replace")}
              placeholder={t("{0} for history", content["arrow-up-and-down"])}
              rows={5}
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
}

export default Step;
