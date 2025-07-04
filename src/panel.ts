import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, l10n, ExtensionContext } from "vscode";
import { getWebviewContent } from "./webview";
import MessageExchange from "./messageExchange";

const { t } = l10n;

export class SerialReplacerPanel {
  public static currentPanel: SerialReplacerPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  constructor(context: ExtensionContext) {
    const panel = window.createWebviewPanel(
      "showPanel",
      t("Serial Replacer"), // Tab title
      ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          Uri.joinPath(context.extensionUri, "out"),
          Uri.joinPath(context.extensionUri, "webview-ui/build"),
        ],
      }
    );
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, context.extensionUri);
    this._setWebviewMessageListener(this._panel.webview);
  }

  public dispose() {
    SerialReplacerPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    return getWebviewContent(webview, extensionUri, t("Serial Replacer Panel"));
  }

  private _setWebviewMessageListener(webview: Webview) {
    const messageExchange = new MessageExchange(
      webview
    );
    webview.onDidReceiveMessage(messageExchange.receivedMessage.bind(messageExchange));
  }
}
