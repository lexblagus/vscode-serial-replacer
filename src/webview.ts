import { Uri, Webview } from "vscode";
import { getUri } from "./utilities/getUri";
import { getNonce } from "./utilities/getNonce";

  /**
   * Actual HTML content for the webview (index.html)
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @param title Document title in HTML head tag
   */
  export function getWebviewContent(webview: Webview, extensionUri: Uri, title: String) {
  const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", /* "assets", */ "index.css"]);
  const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", /* "assets", */ "index.js"]);
  const fontUri = getUri(webview, extensionUri, ["webview-ui", "build", /* "assets", */ "codicon.ttf"]);

  const nonce = getNonce();

  const cspContent = [
    ["default-src", webview.cspSource /* "'none'" */ ],
    ["style-src", webview.cspSource],
    ["font-src", webview.cspSource],
    ["script-src", `'nonce-${nonce}'`],
  ]
    .map((pair) => pair.join(" "))
    .join("; ");

  // FIXME: somehow make the Codicon @font-face src url points to fontUri in index.css

  // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
  return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${title}</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="${cspContent}">
          <link rel="stylesheet" type="text/css" href="${stylesUri}" nonce="${nonce}" id="vscode-codicon-stylesheet">
        </head>
        <body>
        <div id="root"></div>
        <code>fontUri = ${fontUri}</code>
        ${/*
        */ ''}
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
}
