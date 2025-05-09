import { vscode } from "./utilities/vscode";
import "./App.css";
import {
  VscodeButton,
  VscodeCollapsible,
  VscodeIcon,
  VscodeScrollable,
  VscodeTree,
} from "@vscode-elements/react-elements";

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
      <p>
        <VscodeButton onClick={handleHowdyClick} icon="replace-all">hello</VscodeButton>
      </p>

      <VscodeCollapsible title="Step 1" description="First replacement">
        <VscodeIcon name="refresh" action-icon slot="actions" aria-role="button"></VscodeIcon>
        <VscodeIcon name="gear" action-icon aria-role="button" slot="decorations"></VscodeIcon>
        <p>
          Suspendisse potenti. Maecenas eu egestas metus. Nulla eget placerat mi, et efficitur
          augue.
        </p>
      </VscodeCollapsible>

      {import.meta.env.DEV ? <vscode-dev-toolbar></vscode-dev-toolbar> : null}
    </main>
  );
}

export default App;
