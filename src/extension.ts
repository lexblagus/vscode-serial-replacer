import { commands, ExtensionContext } from "vscode";
import { SerialReplacerPanel } from "./panels/SerialReplacerPanel";

export function activate(context: ExtensionContext) {
  // Create the 'show serial replacer panel' command
  const showPanelCommand = commands.registerCommand("serial-replacer.showPanel", () => {
    SerialReplacerPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showPanelCommand);
}
