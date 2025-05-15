import { vscode } from "./utilities/vscode";
import { config, t } from "@vscode/l10n";
import "./App.css";
import {
  VscodeBadge,
  VscodeButton,
  VscodeCollapsible,
  VscodeDivider,
  VscodeFormContainer,
  VscodeFormGroup,
  VscodeIcon,
  VscodeLabel,
  VscodeOption,
  VscodeScrollable,
  VscodeSingleSelect,
  VscodeTextfield,
  VscodeTree,
} from "@vscode-elements/react-elements";
import { toWordsOrdinal } from "number-to-words";

if (import.meta.env.DEV) {
  await import("@vscode-elements/webview-playground");
}

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

const content = {
  "sample-file-pattern": "*.ts, src/**/include",
  "arrow-up-and-down": "\u21C5",
};

function App() {
  config({
    contents: (window as any).i10nBundle,
  });

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

  const data = {
    includeFiles: "",
    useCurrentEditor: true,
    excludeFiles: "",
    resultsLength: Math.floor(Math.random() * 3),
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
    steps: Array.from({ length: 3 }, (_, i) => ({
      title: t("Step {0}", (i + 1).toString()), // should not allow repeated titles
    })),
  };

  const treeData = [
    {
      label: t("{0} files", "999"),
      subItems: data.results,
    },
  ];

  function handleHelloClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there!",
    });
  }

  return (
    <main>
      <VscodeFormContainer className="no-max-width">
        <VscodeFormGroup variant="vertical" className="no-y-margin">
          <VscodeLabel htmlFor="includeFiles" className="label-discreet">
            {t("files to include")}
          </VscodeLabel>
          <VscodeTextfield
            id="includeFiles"
            className="textfield-full"
            placeholder={t(
              "e.g. {0} ({1} for history)",
              content["sample-file-pattern"],
              content["arrow-up-and-down"]
            )}
            title={t(
              "e.g.: {0} ({1} for history)",
              content["sample-file-pattern"],
              content["arrow-up-and-down"]
            )}
            value={data.includeFiles}>
            <VscodeIcon
              slot="content-after"
              name="book"
              id="currentEditor"
              title={t("Use current editor")}
              action-icon></VscodeIcon>
          </VscodeTextfield>
        </VscodeFormGroup>

        <VscodeFormGroup variant="vertical" className="no-top-margin">
          <VscodeLabel htmlFor="excludeFiles" className="label-discreet">
            {t("files to exclude")}
          </VscodeLabel>
          <VscodeTextfield
            id="excludeFiles"
            className="textfield-full"
            placeholder={t(
              "e.g. {0} ({1} for history)",
              content["sample-file-pattern"],
              content["arrow-up-and-down"]
            )}
            title={t(
              "e.g.: {0} ({1} for history)",
              content["sample-file-pattern"],
              content["arrow-up-and-down"]
            )}
            value={data.excludeFiles}>
            <VscodeIcon
              slot="content-after"
              name="exclude"
              id="useExcludeFiles"
              title={t("Use exclude settings and ignore files")}
              action-icon></VscodeIcon>
          </VscodeTextfield>
        </VscodeFormGroup>

        {data.resultsLength === 0 && <p className="no-bottom-margin">{t("No files")}</p>}
        {data.resultsLength === 1 && (
          <p className="no-bottom-margin">{t("Current file: {0}", "Untilted.txt")}</p>
        )}
        {data.resultsLength === 2 && <VscodeTree arrows indent={20} indentGuides data={treeData} />}

        <br />

        {data.steps.map((step, index) => (
          <div className="thin-bottom-margin">
            <VscodeCollapsible title={step.title} key={step.title}>
              <VscodeIcon
                action-icon
                aria-role="button"
                slot="decorations"
                name="edit"
                label={t("rename")}
                title={t("rename")}></VscodeIcon>
              {data.steps.length > 1 && (
                <>
                  {index + 1 < data.steps.length ? (
                    <VscodeIcon
                      action-icon
                      aria-role="button"
                      slot="decorations"
                      name="arrow-down"
                      label={t("move down")}
                      title={t("move down")}></VscodeIcon>
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
                      title={t("move up")}></VscodeIcon>
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
                title={t("add step bellow")}></VscodeIcon>
              <VscodeIcon
                action-icon
                aria-role="button"
                slot="decorations"
                name="debug-step-out"
                label={t("add step above")}
                title={t("add step above")}></VscodeIcon>
              <VscodeIcon
                action-icon
                aria-role="button"
                slot="decorations"
                name="circle-slash"
                label={t("Disable")}
                title={t("Disable")}></VscodeIcon>
              <VscodeIcon
                action-icon
                aria-role="button"
                slot="decorations"
                name="trash"
                label={t("remove")}
                title={t("remove")}></VscodeIcon>
              <p>
                Suspendisse potenti. Maecenas eu egestas metus. Nulla eget placerat mi, et efficitur
                augue.
              </p>
            </VscodeCollapsible>
          </div>
        ))}

        <p>
          <VscodeButton onClick={handleHelloClick} icon="replace-all" className="display-block">
            {t("Serial Replace")}
          </VscodeButton>
        </p>
      </VscodeFormContainer>

      {import.meta.env.DEV ? <vscode-dev-toolbar></vscode-dev-toolbar> : null}
    </main>
  );
}

export default App;
