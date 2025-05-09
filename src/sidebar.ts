import {
  WebviewViewProvider,
  WebviewView,
  Uri,
  WebviewViewResolveContext,
  CancellationToken,
  Webview,
  window,
} from "vscode";
import { getWebviewContent } from './webview';

export class SerialReplacerSidebarProvider implements WebviewViewProvider {
  public static readonly viewType = "serialReplacer.editorView";

  private _view?: WebviewView;

  constructor(private readonly _extensionUri: Uri) {}

  public resolveWebviewView(
    webviewView: WebviewView,
    _context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);

    webviewView.webview.onDidReceiveMessage((message) => {
      const command = message.command;
      const text = message.text;

      switch (command) {
        case "hello":
          window.showInformationMessage(text);
          break;
      }
    });
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    return getWebviewContent(webview, extensionUri, 'Serial Replacer Sidebar');
  }
}
