import { VscodeButton, VscodeFormContainer } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import FileFilters from "./FileFilters";
import Step from "./Step";
import { useAppContext } from "../context";
import { VscodeButtonMouseEventHandler } from "../types/events";
import { vscode } from "../utils/vscode";

import type { FC } from "react";

if (import.meta.env.DEV) {
  await import("@vscode-elements/webview-playground");
}

export const Main: FC = () => {
  console.log("▶ Main");

  const {
    state: { loaded },
    dispatch,
  } = useAppContext();

  const handleSerialReplaceClick: VscodeButtonMouseEventHandler = (event) => {
    vscode.postMessage({
      command: "REPLACE_ALL",
      payload: loaded.steps,
    });
  };

  return (
    <main>
      <VscodeFormContainer className="no-max-width">
        <FileFilters />

        {loaded.steps.map((step, index) => (
          <Step key={step.id} index={index} />
        ))}

        <br />
        <div className="button-group">
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
