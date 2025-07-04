import { l10n, Webview, window } from "vscode";
import { WebviewMessage, ExtensionMessage } from "./types";

const { bundle } = l10n;

export class MessageExchange {
  private readonly _webview: Webview;
  private _ready = false;

  constructor(private readonly webview: Webview) {
    this._webview = webview;
  }

  get ready(): boolean {
    return this._ready;
  }

  private set ready(state: boolean) {
    this._ready = state;
  }

  private _proccessMessage(messageReceived: WebviewMessage): void {
    switch (messageReceived.command) {
      case "SHOW_INFORMATION_MESSAGE":
        window.showInformationMessage(messageReceived.payload);
        this.postMessage({
          type: "SEND_LOG",
          payload: messageReceived.payload,
        });
        return;

      case "GET_FILES":
        this.postMessage({
          type: "SET_FILES",
          payload: ["Readme.MD", "Untitled-1", "Untitled-2"].filter(() => Math.random() < 0.5),
        });
        return;
    }
  }

  public receivedMessage(messageReceived: WebviewMessage): void {
    this._proccessMessage(messageReceived);
  }

  public postMessage(sendMessage: ExtensionMessage): void {
    this._webview.postMessage(sendMessage);
  }
}

export default MessageExchange;
