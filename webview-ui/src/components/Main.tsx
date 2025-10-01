import { VscodeButton, VscodeFormContainer } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import Files from "./Files";
import Step from "./Step";
import { useAppContext } from "../context";
import { vscode } from "../utils/vscode";

import type { FC } from "react";
import type { VscodeButtonMouseEventHandler } from "../types/events";

if (import.meta.env.DEV) {
  await import("@vscode-elements/webview-playground");
}

export const Main: FC = () => {
  console.log("▶ Main");

  const {
    state: {
      loaded: { steps },
    },
  } = useAppContext();

  const handleSerialReplaceClick: VscodeButtonMouseEventHandler = (event) => {
    vscode.postMessage({
      command: "REPLACE_ALL",
      payload: steps,
    });
  };

  return (
    <main>
      <VscodeFormContainer className="no-max-width">
        <Files />

        {steps.map((step, index) => (
          <Step key={step.id} index={index} />
        ))}

        <div className="button-group top-margin">
          <VscodeButton
            onClick={handleSerialReplaceClick}
            icon="replace-all"
            className="button-group-grow"
            title={t("Make replacements")}>
            {t("Serial Replace")}
          </VscodeButton>
        </div>
      </VscodeFormContainer>

      {import.meta.env.DEV ? <vscode-dev-toolbar></vscode-dev-toolbar> : null}
    </main>
  );
};

export default Main;
