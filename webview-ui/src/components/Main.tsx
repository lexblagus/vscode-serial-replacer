import type { FC } from "react";
import { t } from "@vscode/l10n";
import { VscodeButton, VscodeFormContainer } from "@vscode-elements/react-elements";
import { useAppContext } from "../context";
import { VscodeButtonMouseEventHandler } from "../types/events";
import FileFilters from "./FileFilters";
import Step from "./Step";
import { vscode } from "../utils/vscode";

if (import.meta.env.DEV) {
  await import("@vscode-elements/webview-playground");
}

export const Main: FC = () => {
  console.log("▶ Main");

  const { state, dispatch } = useAppContext();

  const handleSerialReplaceClick: VscodeButtonMouseEventHandler = (event) => {
    vscode.postMessage({
      command: "REPLACE_ALL",
      payload: state.steps,
    });
  };

  const handleSaveSetClick: VscodeButtonMouseEventHandler = (event) => {
    // TODO: save set
  };

  return (
    <main>
      <VscodeFormContainer className="no-max-width">
        <FileFilters />

        {state.steps.map((step, index) => (
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
          <VscodeButton
            icon="save"
            title={t("Save set…")}
            onClick={handleSaveSetClick}></VscodeButton>
        </div>
      </VscodeFormContainer>

      {import.meta.env.DEV ? <vscode-dev-toolbar></vscode-dev-toolbar> : null}
    </main>
  );
};

export default Main;
