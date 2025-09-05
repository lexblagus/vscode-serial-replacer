import {
  WebviewViewProvider,
  WebviewView,
  Uri,
  WebviewViewResolveContext,
  CancellationToken,
  Webview,
  l10n,
  ExtensionContext,
} from "vscode";
import { getWebviewContent } from "./webview";
import SerialReplacer from "./serialReplacer";

const { t } = l10n;

export class SerialReplacerSidebarProvider implements WebviewViewProvider {
  public static readonly viewType = "serialReplacer.editorView";

  private _view?: WebviewView;

  constructor(private readonly _context: ExtensionContext) {}

  public resolveWebviewView(
    webviewView: WebviewView,
    _context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri],
    };

    webviewView.webview.html = this._getWebviewContent(
      webviewView.webview,
      this._context.extensionUri
    );

    const messageExchange = new SerialReplacer(this._context, this._view.webview, "sidebar");
    webviewView.webview.onDidReceiveMessage(messageExchange.receiveMessage.bind(messageExchange));
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    return getWebviewContent(webview, extensionUri, t("Serial Replacer Sidebar"));
  }
}
