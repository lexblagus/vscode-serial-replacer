import { useEffect, useCallback, useRef, useState } from "react";
import { VscodeFormGroup, VscodeLabel, VscodeTextfield } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import CurrentEditors from "./CurrentEditors";
import { useAppContext } from "../../context";
import { debounce, detectNavigationDirection, retrieveIndexHistory, text } from "../../utils/etc";
import config from "../../config.json";
import { log } from "../../utils/log";

import type { FC } from "react";
import type { VscodeTextfieldConstructor } from "../../types/dependencies";

const ToInclude: FC = () => {
  log("component", "ToInclude", "log", "rendered");

  const {
    state: {
      loaded: { includeFiles: fieldValue },
      fieldHistory: { includeFiles: history },
      transient: {
        historyFieldIndex: { includeFiles: indexHistory },
      },
    },
    dispatch,
  } = useAppContext();

  const [direction, setDirection] = useState(0);

  const fieldRef = useRef<VscodeTextfieldConstructor>(null);

  const updateFieldFromHistory = useCallback(() => {
    log("function", "updateFieldFromHistory", "log", "called");

    const textfield = fieldRef.current;
    if (!textfield) {
      return;
    }
    const retrievedIndex = retrieveIndexHistory(direction, indexHistory, history);

    log(
      "function",
      "updateFieldFromHistory",
      "debug",
      `parameters=${JSON.stringify({
        "textfield.value": textfield.value,
        history,
        "history.length": history.length,
        indexHistory,
        direction,
        retrievedIndex,
      })}`
    );

    if (history.length === 0 || !direction || retrievedIndex === indexHistory) {
      return;
    }

    const historicalValue = history[retrievedIndex];

    log(
      "function",
      "updateFieldFromHistory",
      "debug",
      `parameters=${JSON.stringify({
        historicalValue,
      })}`
    );

    dispatch({ type: "SET_FILES_TO_INCLUDE", payload: historicalValue });

    dispatch({
      type: "SET_TRANSIENT_DATA",
      payload: {
        historyFieldIndex: {
          includeFiles: retrievedIndex,
        },
      },
    });
  }, [fieldRef, retrieveIndexHistory, history, indexHistory, direction, dispatch]);

  const insertNewFieldValue = useCallback(() => {
    log("function", "insertNewFieldValue", "log", "called");

    const textfield = fieldRef.current;
    if (!textfield) {
      return;
    }

    log(
      "function",
      "insertNewFieldValue",
      "debug",
      `parameters=${JSON.stringify({
        fieldValue,
        "textfield.value": textfield.value,
        history,
        indexHistory,
      })}`
    );

    if (fieldValue === textfield.value) {
      return;
    }

    dispatch({ type: "SET_FILES_TO_INCLUDE", payload: textfield.value });

    if (history[indexHistory] === textfield.value && indexHistory !== 0) {
      return;
    }

    dispatch({
      type: "SET_FIELD_HISTORY",
      payload: {
        field: "includeFiles",
        value: textfield.value,
      },
    });

    dispatch({
      type: "SET_TRANSIENT_DATA",
      payload: {
        historyFieldIndex: {
          includeFiles: 0,
        },
      },
    });
  }, [fieldRef, fieldValue, history, indexHistory, dispatch]);

  useEffect(() => {
    log("effect", "ToInclude", "log", "Setup handlers");

    const textfield = fieldRef.current;
    if (!textfield) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      log("handler", "handleKeyDown", "log", `event.key=${JSON.stringify(event.key)}`);

      const detectedDirection = detectNavigationDirection(event.key, textfield);
      setDirection(detectedDirection);
    };

    const handleKeyUp = debounce((_event: KeyboardEvent) => {
      log("handler", "handleKeyUp", "log", `parameters=${JSON.stringify({ direction })}`);

      if (direction) {
        updateFieldFromHistory();
        setDirection(0);
        return;
      }

      insertNewFieldValue();
    }, config.debounceDelay);

    const handleChange = (_event: KeyboardEvent) => {
      log("handler", "handleChange", "log");
      insertNewFieldValue();
    };

    textfield.addEventListener("keydown", handleKeyDown);
    textfield.addEventListener("keyup", handleKeyUp);
    textfield.addEventListener("change", handleChange);

    return () => {
      textfield.removeEventListener("keydown", handleKeyDown);
      textfield.removeEventListener("keyup", handleKeyUp);
      textfield.removeEventListener("change", handleChange);
    };
  }, [
    fieldRef,
    detectNavigationDirection,
    setDirection,
    updateFieldFromHistory,
    insertNewFieldValue,
    config,
  ]);

  const placeholder =
    t("e.g. {0}", text["sample-file-pattern"]) +
    (history.length > 0 ? ` (${t("{0} for history", text["arrow-up-and-down"])})` : "");
  const title =
    t("e.g. {0}", text["sample-file-pattern"]) +
    (history.length > 0 ? ` (${t("{0} for history", text["arrow-up-and-down"])})` : "");

  return (
    <VscodeFormGroup variant="vertical" className="no-y-margin">
      <VscodeLabel htmlFor="includeFiles" className="text-discreet">
        {t("files to include")}
        {indexHistory > 0 && fieldValue === history[indexHistory] && (
          <span className="text-super-dimmed">
            {" "}
            ({t("{0}/{1} from history", history.length - indexHistory, history.length)})
          </span>
        )}
      </VscodeLabel>
      <VscodeTextfield
        id="includeFiles"
        ref={fieldRef}
        className="textfield-full"
        placeholder={placeholder}
        title={title}
        value={fieldValue}>
        <CurrentEditors />
      </VscodeTextfield>
    </VscodeFormGroup>
  );
};

export default ToInclude;
