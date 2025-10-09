import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import { vscode } from "../utils/vscode";
import { log } from "../utils/log";

import type { FC } from "react";
import type { LinkMouseEventHandler } from "../types/events";

export const Footer: FC = () => {
  log("component", "Footer", "log", "rendered");

  const {
    state: { loaded },
    dispatch,
  } = useAppContext();

  const handleSettingsClick: LinkMouseEventHandler = (event) => {
    log("handler", "handleAboutClick", "log");

    event.preventDefault();
    vscode.postMessage({
      command: "OPEN_SETTINGS",
    });
  };

  const handleResetClick: LinkMouseEventHandler = (event) => {
    log("handler", "handleResetClick", "log");

    event.preventDefault();
    vscode.postMessage({
      command: "CONFIRM_RESET",
    });
  };

  return (
    <footer>
      <div className="text-discreet top-margin medium-bottom-margin x-end gap-em">
        <a href="#" onClick={handleSettingsClick}>
          {t("settings")}
        </a>
        <a href="#" onClick={handleResetClick}>
          {t("reset")}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
