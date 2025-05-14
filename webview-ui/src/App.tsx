import { vscode } from "./utilities/vscode";
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

const l11n = {
  includeFiles: {
    label: 'files to include',
    placeholder: `e.g. *.ts, src/**/include (\u21C5 for history)`,
    badgeFiles: `Files`,
    currentEditor: 'Search in current editor',
  },
};

function App() {
  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there!",
    });
  }

  return (
    <main>
      <VscodeFormContainer>
        <VscodeFormGroup variant="vertical">
          <VscodeLabel htmlFor="includeFiles">{l11n.includeFiles.label}</VscodeLabel>
          <VscodeTextfield
            id="includeFiles"
            placeholder={l11n.includeFiles.placeholder}
            title={l11n.includeFiles.placeholder}
          >
            <VscodeBadge slot="content-after">88888 {l11n.includeFiles.badgeFiles}</VscodeBadge>
            <VscodeIcon
              slot="content-after"
              name="book"
              id="currentEditor"
              title={l11n.includeFiles.currentEditor}
              action-icon
            ></VscodeIcon>
          </VscodeTextfield>
        </VscodeFormGroup>
      </VscodeFormContainer>

      <VscodeDivider />

      <p>
        <VscodeButton onClick={handleHowdyClick} icon="replace-all">hello</VscodeButton>
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
