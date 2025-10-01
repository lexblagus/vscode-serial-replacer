import { useEffect, useCallback, useRef, useState } from "react";
import { VscodeFormGroup, VscodeLabel, VscodeTextfield } from "@vscode-elements/react-elements";
import { t } from "@vscode/l10n";
import CurrentEditors from "./CurrentEditors";
import { useAppContext } from "../../context";
import { debounce, detectNavigationDirection, retrieveIndexHistory, text } from "../../utils/etc";
import config from "../../config.json";

import type { FC } from "react";
import type { VscodeTextfieldConstructor } from "../../types/dependencies";

const ToInclude: FC = () => {
  console.log("▶ ToInclude");

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

  const updateFieldFromHistory = useCallback(
    () => {
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

      dispatch({ type: "SET_FILES_TO_INCLUDE", payload: historicalValue });

      dispatch({
        type: "SET_TRANSIENT_DATA",
        payload: {
          historyFieldIndex: {
            includeFiles: retrievedIndex,
          },
        },
      });
    },
    [fieldRef, history, indexHistory, direction, dispatch]
  );

  const insertNewFieldValue = useCallback(
    () => {
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
    },
    [fieldRef, fieldValue, history, indexHistory, dispatch]
  );

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

  return (
    <VscodeFormGroup variant="vertical" className="no-y-margin">
      <VscodeLabel htmlFor="includeFiles" className="text-discreet">
        {t("files to include")}
      </VscodeLabel>
      <VscodeTextfield
        id="includeFiles"
        ref={fieldRef}
        className="textfield-full"
        placeholder={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
          "{0} for history",
          text["arrow-up-and-down"]
        )})`}
        title={`${t("e.g. {0}", text["sample-file-pattern"])} (${t(
          "{0} for history",
          text["arrow-up-and-down"]
        )})`}
        value={fieldValue}>
        <CurrentEditors />
      </VscodeTextfield>
    </VscodeFormGroup>
  );
};

export default ToInclude;
