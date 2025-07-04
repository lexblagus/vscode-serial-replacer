import {
  WebviewViewProvider,
  WebviewView,
  Uri,
  WebviewViewResolveContext,
  CancellationToken,
  Webview,
  window,
  l10n,
  ExtensionContext,
} from "vscode";
import { getWebviewContent } from "./webview";
import MessageExchange from "./messageExchange";

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

    webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._context.extensionUri);

    const messageExchange = new MessageExchange(
      this._view.webview
    );
    webviewView.webview.onDidReceiveMessage(messageExchange.receivedMessage.bind(messageExchange));

    /*
    this._message.postMessage({
      type: "SEND_LOG",
      payload: { sidebar: `WORKS` },
    });
    */
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    return getWebviewContent(webview, extensionUri, t("Serial Replacer Sidebar"));
  }
}
