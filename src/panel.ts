import {
  Disposable,
  Webview,
  WebviewPanel,
  window,
  Uri,
  ViewColumn,
  l10n,
  ExtensionContext,
} from "vscode";
import { getWebviewContent } from "./webview";
import SerialReplacer from "./serialReplacer";

const { t } = l10n;

export class SerialReplacerPanel {
  private _context: ExtensionContext;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private _serialReplacer: SerialReplacer | null;

  constructor(extensionContext: ExtensionContext) {
    this._context = extensionContext;
    const panel = window.createWebviewPanel(
      "showPanel",
      t("Serial Replacer"), // Tab title
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          Uri.joinPath(extensionContext.extensionUri, "out"),
          Uri.joinPath(extensionContext.extensionUri, "webview-ui/build"),
        ],
      }
    );
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      this._context.extensionUri
    );
    this._setWebviewMessageListener(this._panel.webview);
    this._serialReplacer = null;
  }

  public dispose() {
    this._serialReplacer?.dispose();
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
    this._serialReplacer = new SerialReplacer(this._context, webview, t('panel'));
    webview.onDidReceiveMessage(this._serialReplacer.receiveMessage.bind(this._serialReplacer));
  }
}
