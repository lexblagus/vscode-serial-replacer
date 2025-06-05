import type { FC } from "react";
import { t } from "@vscode/l10n";
import { useAppContext } from "../context";
import type { LinkMouseEventHandler } from "../types";


export const Footer: FC = () => {
  const { state, dispatch } = useAppContext();

  const handleResetClick: LinkMouseEventHandler = (event) => {
    // TODO
  };

  const handleAboutClick: LinkMouseEventHandler = (event) => {
    // TODO
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

export default Footer