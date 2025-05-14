import { window, commands, ExtensionContext, Uri, l10n } from "vscode";
import { SerialReplacerPanel } from "./panel";
import { SerialReplacerSidebarProvider } from "./sidebar";

export async function activate(context: ExtensionContext) {
  const showPanelCommand = commands.registerCommand("serial-replacer.showPanel", () => {
    SerialReplacerPanel.render(context.extensionUri);
  });

  context.subscriptions.push(showPanelCommand);

  const provider = new SerialReplacerSidebarProvider(context.extensionUri);

  context.subscriptions.push(
    window.registerWebviewViewProvider(
      SerialReplacerSidebarProvider.viewType,
      provider
    )
  );
}
