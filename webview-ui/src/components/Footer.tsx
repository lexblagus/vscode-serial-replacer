import type { FC } from "react";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import { vscode } from "../utils/vscode";
import type { LinkMouseEventHandler } from "../types/events";

export const Footer: FC = () => {
  console.log("▶ Footer");

  const { state, dispatch } = useAppContext();

  const handleResetClick: LinkMouseEventHandler = (event) => {
    console.log("▷ handleResetClick");

    event.preventDefault();
    vscode.postMessage({
      command: "CONFIRM_RESET",
    });
  };

  const handleAboutClick: LinkMouseEventHandler = (event) => {
    console.log("▷ handleAboutClick");

    event.preventDefault();
    // TODO: about
  };

  return (
    <footer>
      <div className="text-discreet top-margin medium-bottom-margin x-end gap-em">
        <a href="#" onClick={handleResetClick}>
          {t("reset")}
        </a>
        <a href="#" onClick={handleAboutClick}>
          {t("about…")}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
