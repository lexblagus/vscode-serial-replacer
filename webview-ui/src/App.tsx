import { vscode } from "./utilities/vscode";
import { config, t } from "@vscode/l10n";
import "./App.css";
import {
  VscodeButton,
  VscodeCollapsible,
  VscodeFormContainer,
  VscodeFormGroup,
  VscodeIcon,
  VscodeLabel,
  VscodeTextarea,
  VscodeTextfield,
  VscodeTree,
} from "@vscode-elements/react-elements";
import { useState } from "react";

if (import.meta.env.DEV) {
  await import("@vscode-elements/webview-playground");
}

const treeActions = [
  {
    icon: "close",
    actionId: "remove",
    tooltip: t("Remove"),
  },
];

const treeIcons = {
  branch: "folder",
  leaf: "file",
  open: "folder-opened",
};

const treeItemConfig = {
  icons: treeIcons,
  actions: treeActions,
};

const content = {
  "sample-file-pattern": "*.ts, src/**/include",
  "arrow-up-and-down": "\u21C5",
};

function App() {
  config({
    contents: (window as any).i10nBundle,
  });

  const initialState = {
    // TODO: type
    includeFiles: "",
    useCurrentEditor: true,
    excludeFiles: "",
    results: [
      {
        ...treeItemConfig,
        label: "Folder A",
        subItems: [
          {
            ...treeItemConfig,
            label: "File A1",
          },
        ],
      },
      {
        ...treeItemConfig,
        label: "Folder B",
        open: true,
        subItems: [
          {
            ...treeItemConfig,
            label: "File B1",
          },
          {
            ...treeItemConfig,
            label: "Folder BA",
            open: true,
            subItems: [
              {
                ...treeItemConfig,
                label: "File BA1",
              },
            ],
          },
        ],
      },
    ],
    resultsTotalFiles: Math.floor(Math.random() * 3),
    steps: Array.from({ length: 3 }, (_, i) => ({
      expanded: Math.random() < 0.25,
      title:
        Math.random() < 0.25 ? t("Step {0}", (i + 1).toString()) : `Named replacement ${i + 1}`, // should not allow repeated titles
      find: {
        content: "",
        regExp: false,
        global: true,
        multiline: true,
        caseSensitive: true,
        wordWrap: true,
      },
      replace: {
        content: "",
        wordWrap: true,
      },
      preview: false,
    })),
  };

  const [state, setState] = useState(initialState);

  const treeData = [
    {
      label: t("{0} files", "999"),
      subItems: state.results,
    },
  ];

  function handleFilesToIncludeChange() {
    // TODO
  }

  function handleCurrentEditorClick() {
    // TODO
  }

  function handleFilesToExcludeChange() {
    // TODO
  }

  function handleExcludeSettingsAndIgnoreFilesClick() {
    // TODO
  }

  function handleFileTreeRemoveFileClick() {
    // TODO
  }

  function handleStepActionEditClick() {
    // TODO
  }

  function handleStepMoveDownClick() {
    // TODO
  }

  function handleStepMoveUpClick() {
    // TODO
  }

  function handleStepAddBellowClick() {
    // TODO
  }

  function handleStepAddAboveClick() {
    // TODO
  }

  function handleStepDisableClick() {
    // TODO
  }

  function handleStepRemoveClick() {
    // TODO
  }

  function handleStepFindRegExpClick() {
    // TODO
  }

  function handleStepFindGlobalClick() {
    // TODO
  }

  function handleStepFindMultilineClick() {
    // TODO
  }

  function handleStepFindCaseSensitiveClick() {
    // TODO
  }

  function handleStepFindWordWrapClick() {
    // TODO
  }

  function handleStepFindChange() {
    // TODO
  }

  function handleStepReplaceWordWrapClick() {
    // TODO
  }

  function handleStepReplaceChange() {
    // TODO
  }

  function handleStepReplacePreviewClick() {
    // TODO
  }

  function handleSerialReplaceClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there!",
    });
  }

  function handleSaveSetClick() {
    // TODO
  }

  return (
    <main>
      <VscodeFormContainer className="no-max-width">
        <VscodeFormGroup variant="vertical" className="no-y-margin">
          <VscodeLabel htmlFor="includeFiles" className="text-discreet">
            {t("files to include")}
          </VscodeLabel>
          <VscodeTextfield
            id="includeFiles"
            className="textfield-full"
            placeholder={`${t("e.g. {0}", content["sample-file-pattern"])} (${t(
              "{0} for history",
              content["arrow-up-and-down"]
            )})`}
            title={`${t("e.g. {0}", content["sample-file-pattern"])} (${t(
              "{0} for history",
              content["arrow-up-and-down"]
            )})`}
            value={state.includeFiles}
            onChange={handleFilesToIncludeChange}>
            <VscodeIcon
              slot="content-after"
              name="book"
              id="currentEditor"
              title={t("Use current editor")}
              action-icon
              onClick={handleCurrentEditorClick}></VscodeIcon>
          </VscodeTextfield>
        </VscodeFormGroup>

        <VscodeFormGroup variant="vertical" className="no-top-margin">
          <VscodeLabel htmlFor="excludeFiles" className="text-discreet">
            {t("files to exclude")}
          </VscodeLabel>
          <VscodeTextfield
            id="excludeFiles"
            className="textfield-full"
            placeholder={`${t("e.g. {0}", content["sample-file-pattern"])} (${t(
              "{0} for history",
              content["arrow-up-and-down"]
            )})`}
            title={`${t("e.g. {0}", content["sample-file-pattern"])} (${t(
              "{0} for history",
              content["arrow-up-and-down"]
            )})`}
            value={state.excludeFiles}
            onChange={handleFilesToExcludeChange}>
            <VscodeIcon
              slot="content-after"
              name="exclude"
              id="useExcludeFiles"
              title={t("Use exclude settings and ignore files")}
              action-icon
              onClick={handleExcludeSettingsAndIgnoreFilesClick}></VscodeIcon>
          </VscodeTextfield>
        </VscodeFormGroup>

        {state.resultsTotalFiles === 0 && <p className="no-bottom-margin">{t("No files")}</p>}
        {state.resultsTotalFiles === 1 && (
          <p className="no-bottom-margin">{t("Current file: {0}", "Untilted.txt")}</p>
        )}
        {state.resultsTotalFiles === 2 && (
          <VscodeTree
            arrows
            indent={20}
            indentGuides
            data={treeData}
            onVscTreeAction={handleFileTreeRemoveFileClick}
          />
        )}

        <br />

        {state.steps.map((step, index) => (
          <div className="thin-bottom-margin" key={step.title}>
            <VscodeCollapsible title={step.title} open={step.expanded}>
              <VscodeIcon
                action-icon
                aria-role="button"
                slot="decorations"
                name="edit"
                label={t("rename")}
                title={t("rename")}
                onClick={handleStepActionEditClick}></VscodeIcon>
              {state.steps.length > 1 && (
                <>
                  {index + 1 < state.steps.length ? (
                    <VscodeIcon
                      action-icon
                      aria-role="button"
                      slot="decorations"
                      name="arrow-down"
                      label={t("move down")}
                      title={t("move down")}
                      onClick={handleStepMoveDownClick}></VscodeIcon>
                  ) : (
                    <VscodeIcon
                      action-icon
                      aria-role="presentation"
                      slot="decorations"
                      name="blank"></VscodeIcon>
                  )}
                  {index > 0 ? (
                    <VscodeIcon
                      action-icon
                      aria-role="button"
                      slot="decorations"
                      name="arrow-up"
                      label={t("move up")}
                      title={t("move up")}
                      onClick={handleStepMoveUpClick}></VscodeIcon>
                  ) : (
                    <VscodeIcon
                      action-icon
                      aria-role="presentation"
                      slot="decorations"
                      name="blank"></VscodeIcon>
                  )}
                </>
              )}
              <VscodeIcon
                action-icon
                aria-role="button"
                slot="decorations"
                name="debug-step-into"
                label={t("add step bellow")}
                title={t("add step bellow")}
                onClick={handleStepAddBellowClick}></VscodeIcon>
              <VscodeIcon
                action-icon
                aria-role="button"
                slot="decorations"
                name="debug-step-out"
                label={t("add step above")}
                title={t("add step above")}
                onClick={handleStepAddAboveClick}></VscodeIcon>
              <VscodeIcon
                action-icon
                aria-role="button"
                slot="decorations"
                name="circle-slash"
                label={t("Disable")}
                title={t("Disable")}
                onClick={handleStepDisableClick}></VscodeIcon>
              <VscodeIcon
                action-icon
                aria-role="button"
                slot="decorations"
                name="trash"
                label={t("remove")}
                title={t("remove")}
                onClick={handleStepRemoveClick}></VscodeIcon>
              <div className="stepInnerWrapper">
                <VscodeFormGroup variant="vertical" className="no-y-margin">
                  <div className="labelAndActions">
                    <div className="label">
                      <VscodeLabel htmlFor={`step${index}FindContent`} className="text-discreet">
                        {t("find")}
                      </VscodeLabel>
                    </div>
                    <div className="actions">
                      <VscodeIcon
                        name="regex"
                        id={`step${index}FindRegExp`}
                        title={t("Use regular expression")}
                        action-icon
                        onClick={handleStepFindRegExpClick}></VscodeIcon>
                      <VscodeIcon
                        name="globe"
                        id={`step${index}FindGlobal`}
                        title={t("Find all occurrences (global)")}
                        action-icon
                        onClick={handleStepFindGlobalClick}></VscodeIcon>
                      <VscodeIcon
                        name="newline"
                        id={`step${index}FindMultiline`}
                        title={t("Search across lines (multiline)")}
                        action-icon
                        onClick={handleStepFindMultilineClick}></VscodeIcon>
                      <VscodeIcon
                        name="case-sensitive"
                        id={`step${index}FindCaseSensitive`}
                        title={t("Case sensitive")}
                        action-icon
                        onClick={handleStepFindCaseSensitiveClick}></VscodeIcon>
                      <VscodeIcon
                        name="word-wrap"
                        id={`step${index}FindWordWrap`}
                        title={t("Word wrap")}
                        action-icon
                        onClick={handleStepFindWordWrapClick}></VscodeIcon>
                    </div>
                  </div>
                  <VscodeTextarea
                    id={`step${index}FindContent`}
                    className="textarea-full"
                    title={t("Find")}
                    label={t("Find")}
                    placeholder={t("{0} for history", content["arrow-up-and-down"])}
                    rows={5}
                    resize="vertical"
                    value={step.find.content}
                    onChange={handleStepFindChange}></VscodeTextarea>
                </VscodeFormGroup>

                <VscodeFormGroup variant="vertical" className="no-y-margin">
                  <div className="labelAndActions">
                    <div className="label">
                      <VscodeLabel htmlFor={`step${index}ReplaceContent`} className="text-discreet">
                        {t("replace")}
                      </VscodeLabel>
                    </div>
                    <div className="actions">
                      <VscodeIcon
                        name="word-wrap"
                        id={`step${index}ReplaceWordWrap`}
                        title={t("Word wrap")}
                        action-icon
                        onClick={handleStepReplaceWordWrapClick}></VscodeIcon>
                    </div>
                  </div>
                  <VscodeTextarea
                    id={`step${index}ReplaceContent`}
                    className="textarea-full"
                    title={t("Replace")}
                    label={t("replace")}
                    placeholder={t("{0} for history", content["arrow-up-and-down"])}
                    rows={5}
                    resize="vertical"
                    value={step.find.content}
                    onChange={handleStepReplaceChange}></VscodeTextarea>
                </VscodeFormGroup>
                <div className="x-end text-discreet">
                  <a href="#" onClick={handleStepReplacePreviewClick}>{t("preview…")}</a>
                </div>
                <br />
              </div>
            </VscodeCollapsible>
          </div>
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
          <VscodeButton icon="save" title={t("Save set…")} onClick={handleSaveSetClick}></VscodeButton>
        </div>
      </VscodeFormContainer>

      {import.meta.env.DEV ? <vscode-dev-toolbar></vscode-dev-toolbar> : null}
    </main>
  );
}

export default App;
