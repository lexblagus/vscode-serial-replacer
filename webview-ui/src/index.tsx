import React from "react";
import { config } from "@vscode/l10n";
import ReactDOM from "react-dom";
import App from "./App";
import { AppProvider } from "./context";
import { log } from "./utils/log";

log('app', "root", 'log', `Starting application`);

config({
  contents: (window as any).i10nBundle,
});

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
