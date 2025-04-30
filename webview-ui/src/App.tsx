import { vscode } from "./utilities/vscode";
import "./App.css";
import "@vscode-elements/elements/dist/vscode-button/index.js";
import { VscodeButton, VscodeCollapsible, VscodeIcon } from "@vscode-elements/react-elements";

if (import.meta.env.DEV) {
  await import("@vscode-elements/webview-playground");
}

function App() {
  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there!",
    });
  }

  return (
    <main>
      {import.meta.env.DEV ? <vscode-dev-toolbar></vscode-dev-toolbar> : null}

      <VscodeButton onClick={handleHowdyClick}>hello</VscodeButton>

      <VscodeCollapsible title="Step 1">
        <p>Suspendisse potenti. Maecenas eu egestas metus. Nulla eget placerat mi, et efficitur augue.</p>
      </VscodeCollapsible>

      <p>
        Account icon:{' '}
        <VscodeIcon name="account" action-icon></VscodeIcon>
        <br />
        Account  span class:{' '}
        <span className="codicon codicon-account"></span>
      </p>
    </main>
  );
}

export default App;
