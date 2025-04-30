import { window, commands, ExtensionContext } from "vscode";
import { SerialReplacerPanel } from "./panel";
import { SerialReplacerSidebarProvider } from "./sidebar";

export function activate(context: ExtensionContext) {
  // Create the 'show serial replacer panel' command
  const showPanelCommand = commands.registerCommand("serial-replacer.showPanel", () => {
    SerialReplacerPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showPanelCommand);

  // Sidebar
  const provider = new SerialReplacerSidebarProvider(context.extensionUri);

  context.subscriptions.push(
    window.registerWebviewViewProvider(
      SerialReplacerSidebarProvider.viewType,
      provider
    )
  );
}
