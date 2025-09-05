import { window, commands, ExtensionContext } from "vscode";
import { SerialReplacerPanel } from "./panel";
import { SerialReplacerSidebarProvider } from "./sidebar";

export async function activate(context: ExtensionContext) {
  const showPanelCommand = commands.registerCommand("serial-replacer.newPanel", () => {
    new SerialReplacerPanel(context);
  });
  context.subscriptions.push(showPanelCommand);

  const sidebarProvider = new SerialReplacerSidebarProvider(context);
  context.subscriptions.push(
    window.registerWebviewViewProvider(SerialReplacerSidebarProvider.viewType, sidebarProvider)
  );
}
