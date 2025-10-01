import { useEffect, useRef } from "react";
import { VscodeCollapsible } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import Actions from "./Actions";
import Find from "./Find";
import Replace from "./Replace";
import { useAppContext } from "../../context";

import type { FC } from "react";
import type { VscodeCollapsibleToggleEventHandler } from "../../types/events";
import type { VscodeCollapsibleConstructor } from "../../types/dependencies";

import "./Step.css";

const Step: FC<{ index: number }> = ({ index }) => {
  const {
    state: { loaded },
    dispatch,
  } = useAppContext();
  const collapsibleRef = useRef<VscodeCollapsibleConstructor>(null);

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

  return (
    <div className="thin-bottom-margin">
      <VscodeCollapsible
        className={step.enabled ? '' : 'dimmed'}
        title={title}
        description={!step.enabled ? `(${t("disabled")})` : undefined}
        ref={collapsibleRef}
        open={step.expanded}>
        <Actions index={index} />
        <div className="stepInnerWrapper">
          <Find index={index} />
          <Replace index={index} />
        </div>
      </VscodeCollapsible>
    </div>
  );
};

export default Step;
