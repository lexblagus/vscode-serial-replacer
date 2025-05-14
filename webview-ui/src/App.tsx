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

if (import.meta.env.DEV) {
  await import("@vscode-elements/webview-playground");
}

const content = {
  'sample-file-pattern': '*.ts, src/**/include',
  'arrow-up-and-down': '\u21C5',
};

function App() {
  config({
      contents: (window as any).i10nBundle
  });

  function handleHelloClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there!",
    });
  }

  return (
    <main>
      <VscodeFormContainer>
        <VscodeFormGroup variant="vertical">
          <VscodeLabel htmlFor="includeFiles">{t('files to include')}</VscodeLabel>
          <VscodeTextfield
            id="includeFiles"
            placeholder={t('e.g. {0} ({1} for history)', content["sample-file-pattern"], content["arrow-up-and-down"])}
            title={t('e.g.: {0} ({1} for history)', content["sample-file-pattern"], content["arrow-up-and-down"])}>
            <VscodeBadge slot="content-after">88888 {t('files')}</VscodeBadge>
            <VscodeIcon
              slot="content-after"
              name="book"
              id="currentEditor"
              title={t('Use current editor')}
              action-icon></VscodeIcon>
          </VscodeTextfield>
        </VscodeFormGroup>
      </VscodeFormContainer>

      <VscodeDivider />

      <p>
        <VscodeButton onClick={handleHelloClick} icon="replace-all">
          hello
        </VscodeButton>
      </p>

      {/*
      <VscodeCollapsible title="Step 1" description="First replacement">
        <VscodeIcon name="refresh" action-icon slot="actions" aria-role="button"></VscodeIcon>
        <VscodeIcon name="gear" action-icon aria-role="button" slot="decorations"></VscodeIcon>
        <p>
          Suspendisse potenti. Maecenas eu egestas metus. Nulla eget placerat mi, et efficitur
          augue.
        </p>
      </VscodeCollapsible>
      */}

      {import.meta.env.DEV ? <vscode-dev-toolbar></vscode-dev-toolbar> : null}
    </main>
  );
}

export default App;
