import { l10n, Uri, Webview } from "vscode";
import { getUri } from "./utilities/getUri";
import { getNonce } from "./utilities/getNonce";

const { bundle, uri } = l10n;

  /**
   * Actual HTML content for the webview (index.html)
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @param title Document title in HTML head tag
   */
  export function getWebviewContent(webview: Webview, extensionUri: Uri, title: String) {
  const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "index.css"]);
  const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "index.js"]);
  const fontUri = getUri(webview, extensionUri, ["webview-ui", "build", "codicon.ttf"]);
  
  const nonce = getNonce();

  const cspContent = [
    ["default-src", "'none'"],
    ["style-src", `'nonce-${nonce}' ${webview.cspSource}`],
    ["font-src", 'https:'],
    ["script-src", `'nonce-${nonce}'`],
  ]
    .map((pair) => pair.join(" "))
    .join("; ");

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
          <style nonce="${nonce}">
            @font-face {
              font-family: codicon;
              font-display: block;
              src: url(${fontUri}) format("truetype")
            }
          </style>
        </head>
        <body>
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        <script nonce="${nonce}">
          window.i10nBundle = ${JSON.stringify(bundle)};
        </script>
        </body>
      </html>
    `;
}
