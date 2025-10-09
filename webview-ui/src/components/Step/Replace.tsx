import { useEffect, useCallback, useRef, useState } from "react";
import { VscodeFormGroup, VscodeLabel, VscodeTextarea } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import ReplaceActions from "./ReplaceActions";
import { useAppContext } from "../../context";
import { debounce, detectNavigationDirection, retrieveIndexHistory, text } from "../../utils/etc";
import { log } from "../../utils/log";
import { getPreloadConfig } from "../../utils/etc";

import type { FC } from "react";
import type { VscodeTextareaConstructor } from "../../types/dependencies";

const Replace: FC<{ index: number }> = ({ index }) => {
  log("component", "Replace", "log", "rendered");

  const config = getPreloadConfig();

  const {
    state: {
      loaded: { steps },
      fieldHistory: { replaceContent: history },
      transient: {
        historyFieldIndex: { replaceContent: indexHistory },
      },
    },
    dispatch,
  } = useAppContext();

  const {
    replace: { content: fieldValue, wordWrap },
  } = steps[index];

  const [direction, setDirection] = useState(0);

  const fieldRef = useRef<VscodeTextareaConstructor>(null);

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

    dispatch({
      type: "SET_STEP_REPLACE",
      payload: {
        index,
        replace: {
          content: historicalValue,
        },
      },
    });

    dispatch({
      type: "SET_TRANSIENT_DATA",
      payload: {
        historyFieldIndex: {
          replaceContent: retrievedIndex,
        },
      },
    });
  }, [fieldRef, history, indexHistory, direction, dispatch]);

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

    dispatch({
      type: "SET_STEP_REPLACE",
      payload: {
        index,
        replace: {
          content: textfield.value,
        },
      },
    });

    if (history[indexHistory] === textfield.value && indexHistory !== 0) {
      return;
    }

    dispatch({
      type: "SET_FIELD_HISTORY",
      payload: {
        field: "replaceContent",
        value: textfield.value,
      },
    });

    dispatch({
      type: "SET_TRANSIENT_DATA",
      payload: {
        historyFieldIndex: {
          replaceContent: 0,
        },
      },
    });
  }, [fieldRef, fieldValue, history, indexHistory, dispatch]);

  useEffect(() => {
    log("effect", "Replace", "log", "Setup handlers");

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
    }, config.fields.keystrokeDebounceDelay);

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
    fieldValue,
    history,
    indexHistory,
    direction,
    insertNewFieldValue,
    updateFieldFromHistory,
    config,
  ]);

  useEffect(() => {
    log("effect", "Replace", "log", "Set word wrap");

    const el = fieldRef.current;
    if (!el) {
      return;
    }

    el.wrappedElement.setAttribute("wrap", wordWrap ? "soft" : "off");
  }, [fieldRef, wordWrap]);

  const placeholder = history.length > 0 ? t("{0} for history", text["arrow-up-and-down"]) : "";

  return (
    <VscodeFormGroup variant="vertical" className="no-y-margin">
      <div className="labelAndActions">
        <div className="label">
          <VscodeLabel htmlFor={`step${index}ReplaceContent`} className="text-discreet">
            {t("replace")}
            {indexHistory > 0 && fieldValue === history[indexHistory] && (
              <span className="text-super-dimmed">
                {" "}
                ({t("{0}/{1} from history", history.length - indexHistory, history.length)})
              </span>
            )}
          </VscodeLabel>
        </div>
        <div className="actions">
          <ReplaceActions index={index} />
        </div>
      </div>
      <VscodeTextarea
        id={`step${index}ReplaceContent`}
        ref={fieldRef}
        className="textarea-full"
        label={t("replace")}
        title={t("Replace")}
        placeholder={placeholder}
        resize="vertical"
        value={fieldValue}></VscodeTextarea>
    </VscodeFormGroup>
  );
};

export default Replace;
