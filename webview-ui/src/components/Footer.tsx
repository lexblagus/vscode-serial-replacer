import type { FC } from "react";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import type { LinkMouseEventHandler } from "../types/events";

export const Footer: FC = () => {
  const { state, dispatch } = useAppContext();

  const handleResetClick: LinkMouseEventHandler = (event) => {
    event.preventDefault();
    // TODO: Are you sure?
    dispatch({
      type: "RESET",
    });
  };

  const handleAboutClick: LinkMouseEventHandler = (event) => {
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
