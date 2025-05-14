import { l10n, window } from "vscode";

const { bundle } = l10n;

const message = (message: any) => {
  const command = message.command;
  const text = message.text;

  switch (command) {
    case "hello":
      window.showInformationMessage(text);
      return;
  }
};

export default message;
