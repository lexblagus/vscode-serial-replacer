import {
  WebviewViewProvider,
  WebviewView,
  Uri,
  WebviewViewResolveContext,
  CancellationToken,
  Webview,
  window,
} from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import packageJson from "../../package.json";

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
    const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
    const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

    const nonce = getNonce();
    const cspContent = [
      "default-src 'none'",
      `style-src ${webview.cspSource}`,
      `script-src 'nonce-${nonce}'`,
    ].join("; ");

    const displayName: string = packageJson.displayName;

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="${cspContent}">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>${displayName}</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }
}
