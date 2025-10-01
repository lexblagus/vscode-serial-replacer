import { useEffect, useCallback, useRef, useState } from "react";
import {
  VscodeFormGroup,
  VscodeLabel,
  VscodeFormHelper,
  VscodeTextarea,
} from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import FindActions from "./FindActions";
import { useAppContext } from "../../context";
import { debounce, detectNavigationDirection, retrieveIndexHistory, text } from "../../utils/etc";
import config from "../../config.json";

import type { FC } from "react";
import type { VscodeTextareaConstructor } from "../../types/dependencies";

const Find: FC<{ index: number }> = ({ index }) => {
  console.log("▶ Find");

  const {
    state: {
      loaded: { steps },
      fieldHistory: { findContent: history },
      transient: {
        historyFieldIndex: { findContent: indexHistory },
      },
    },
    dispatch,
  } = useAppContext();

  const {
    find: { content: fieldValue, wordWrap, regExp, caseSensitive },
  } = steps[index];

  const [findErrorMessage, setFindErrorMessage] = useState<string | null>(null);

  const [direction, setDirection] = useState(0);

  const fieldRef = useRef<VscodeTextareaConstructor>(null);

  const updateFieldFromHistory = useCallback(() => {
    const textfield = fieldRef.current;
    if (!textfield) {
      return;
    }
    const retrievedIndex = retrieveIndexHistory(direction, indexHistory, history);

    console.log(
      `○ updateFieldFromHistory parameters=${JSON.stringify({
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

    console.log(
      `parameters=${JSON.stringify({
        historicalValue,
      })}`
    );

    dispatch({
      type: "SET_STEP_FIND",
      payload: {
        index,
        find: {
          content: historicalValue,
        },
      },
    });

    dispatch({
      type: "SET_TRANSIENT_DATA",
      payload: {
        historyFieldIndex: {
          findContent: retrievedIndex,
        },
      },
    });
  }, [fieldRef, history, indexHistory, direction, dispatch]);

  const insertNewFieldValue = useCallback(() => {
    const textfield = fieldRef.current;
    if (!textfield) {
      return;
    }

    console.log(
      "○ insertNewFieldValue",
      JSON.stringify({
        fieldValue,
        "textfield.value": textfield.value,
        history,
        indexHistory,
      })
    );

    if (fieldValue === textfield.value) {
      return;
    }

    dispatch({
      type: "SET_STEP_FIND",
      payload: {
        index,
        find: {
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
        field: "findContent",
        value: textfield.value,
      },
    });

    dispatch({
      type: "SET_TRANSIENT_DATA",
      payload: {
        historyFieldIndex: {
          findContent: 0,
        },
      },
    });
  }, [fieldRef, fieldValue, history, indexHistory, dispatch]);

  useEffect(() => {
    const textfield = fieldRef.current;
    if (!textfield) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("○ handleKeyDown");

      const detectedDirection = detectNavigationDirection(event.key, textfield);
      setDirection(detectedDirection);
    };

    const handleKeyUp = debounce((_event: KeyboardEvent) => {
      console.log(`○ handleKeyUp parameters=${JSON.stringify({ direction })}`);

      if (direction) {
        updateFieldFromHistory();
        setDirection(0);
        return;
      }

      insertNewFieldValue();
    }, config.debounceDelay);

    const handleChange = (_event: KeyboardEvent) => {
      console.log("○ handleChange");
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
  ]);

  useEffect(() => {
    // Word wrap
    const el = fieldRef.current;
    if (!el) {
      return;
    }

    el.wrappedElement.setAttribute("wrap", wordWrap ? "soft" : "off");
  }, [fieldRef, wordWrap]);

  useEffect(() => {
    // Evaluate regular expression
    try {
      if (regExp) {
        new RegExp(fieldValue, ["g", !caseSensitive && "i", "m"].filter(Boolean).join(""));
      }
    } catch (err) {
      if (err instanceof Error) {
        setFindErrorMessage(err.message);
        return;
      }
      setFindErrorMessage(`${err}`);
      return;
    }

    setFindErrorMessage(null);
  }, [regExp, fieldValue, caseSensitive, setFindErrorMessage]);

  return (
    <VscodeFormGroup variant="vertical" className="no-y-margin">
      <div className="labelAndActions">
        <div className="label">
          <VscodeLabel htmlFor={`step${index}FindContent`} className="text-discreet">
            {t("find")}
            {indexHistory > 0 && fieldValue === history[indexHistory] && (
              <span className="text-super-dimmed">
                {" "}
                ({t('{0}/{1} from history', history.length - indexHistory, history.length)})
              </span>
            )}
          </VscodeLabel>
        </div>
        <div className="actions">
          <FindActions index={index} />
        </div>
      </div>
      <VscodeTextarea
        id={`step${index}FindContent`}
        ref={fieldRef}
        className="textarea-full"
        label={t("find")}
        title={t("Find")}
        placeholder={t("{0} for history", text["arrow-up-and-down"])}
        resize="vertical"
        value={fieldValue}
        invalid={findErrorMessage !== null}></VscodeTextarea>
      {findErrorMessage && (
        <VscodeFormHelper className="error-message">{findErrorMessage}</VscodeFormHelper>
      )}
    </VscodeFormGroup>
  );
};

export default Find;
