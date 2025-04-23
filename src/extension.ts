import * as vscode from "vscode";
import { commands, ExtensionContext } from "vscode";
import { SerialReplacerPanel } from "./panels/SerialReplacerPanel";
import { SerialReplacerSidebarProvider } from "./sidebars/SerialReplacerSidebar";

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
    vscode.window.registerWebviewViewProvider(
      SerialReplacerSidebarProvider.viewType,
      provider
    )
  );
}
