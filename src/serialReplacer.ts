import {
  Disposable,
  ExtensionContext,
  l10n,
  OutputChannel,
  TabInputText,
  Webview,
  window,
  workspace,
} from "vscode";
import { basename } from "path";
import type { FileFilters } from "webview-ui/src/types/replacers";
import type { WebviewMessage, ExtensionMessage, Files } from "./types";

const { bundle } = l10n;

function safeStringify(obj: any) {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    },
    2
  );
}

enum LogLevel {
  silent = 0,
  fatal = 1,
  error = 2,
  warn = 3,
  info = 4,
  debug = 5,
  trace = 6,
}

export class SerialReplacer {
  private readonly _context: ExtensionContext;
  private readonly _webview: Webview;
  private readonly _tag: string;
  private readonly _outputChannel: OutputChannel;
  private _fileFilters: FileFilters | null;
  private _subscriptions: Disposable[] = [];

  constructor(
    private readonly extensionContext: ExtensionContext,
    private readonly webview: Webview,
    private readonly tag: string
  ) {
    this._context = extensionContext;
    this._webview = webview;
    this._tag = tag;
    this._outputChannel = window.createOutputChannel(`Serial Replacer ${tag}`, 'log');
    this._fileFilters = null;

    this._log(LogLevel.info, `Serial Replacer ${tag} initialized`);
  }

  private _log(level: LogLevel, message: string) {
    const configLevel = LogLevel["trace"]; // TODO: put in User Preference
    const maxLogMessageSize = 1024;
    if (
      configLevel < level ||
      (configLevel as LogLevel) === LogLevel.silent ||
      level === LogLevel.silent
    ) {
      return;
    }
    this._outputChannel.appendLine(
      `[${new Date().toISOString()}] ${LogLevel[level].toUpperCase()} ${((msg, maxSize) =>
        msg.length > maxSize ? `${msg.slice(0, maxSize)}… (truncated)` : msg)(message, maxLogMessageSize)}\n`
    );
  }

  private async _setFiles() {
    this._log(LogLevel.trace, `Set files: fileFilters=${JSON.stringify(this._fileFilters)}`);

    if (!this._fileFilters) {
      return;
    }

    const selectedFiles: Files = {
      workspaces: [],
      files: [],
    };

    for (const workspaceFolder of workspace.workspaceFolders ?? []) {
      selectedFiles.workspaces.push(workspaceFolder.uri.fsPath);
    }

    if (this._fileFilters.useCurrentEditors) {
      for (const tabGroup of window.tabGroups.all) {
        for (const tab of tabGroup.tabs) {
          if (tab.input instanceof TabInputText) {
            // TODO: apply filters
            selectedFiles.files.push(tab.input.uri.fsPath);
          }
        }
      }
    }

    if (!this._fileFilters.useCurrentEditors) {
      const workspaceFiles = await workspace.findFiles("**/*");
      selectedFiles.files = workspaceFiles.map((item) => item.fsPath);
    }

    this._log(LogLevel.debug, `files=${JSON.stringify(selectedFiles)}`);

    this.postMessage({
      type: "SET_FILES",
      payload: selectedFiles,
    });
  }

  private _subscribeChanges() {
    this._log(
      LogLevel.trace,
      `Subscribe to file changes: fileFilters=${JSON.stringify(this._fileFilters)}`
    );

    this.dispose();

    const changedFiles = (scope: string) => () => {
      this._log(LogLevel.info, `File changes: scope=${JSON.stringify(scope)}`);
      this._setFiles();
    };

    // Fired when any config value changes.
    workspace.onDidChangeConfiguration(changedFiles("workspace.onDidChangeConfiguration"));
    // Fired when files are renamed.
    workspace.onDidRenameFiles(changedFiles("workspace.onDidRenameFiles"));
    // Fired when files are deleted.
    workspace.onDidDeleteFiles(changedFiles("workspace.onDidDeleteFiles"));
    // Fired when new files are created.
    workspace.onDidCreateFiles(changedFiles("workspace.onDidCreateFiles"));
    // Fired when the window gains or loses focus.
    // window.onDidChangeWindowState(changedFiles("window.onDidChangeWindowState")); // Maybe remove

    if (this._fileFilters?.useCurrentEditors) {
      // Fired when a text document is opened.
      workspace.onDidOpenTextDocument(changedFiles("workspace.onDidOpenTextDocument"));
      // Fired when a text document is closed.
      workspace.onDidCloseTextDocument(changedFiles("workspace.onDidCloseTextDocument"));
      // Fired when the list of visible editors changes (e.g., split view).
      // window.onDidChangeVisibleTextEditors(changedFiles("window.onDidChangeVisibleTextEditors"));
      //Fires when user switches to a different editor (tab)
      // window.onDidChangeActiveTextEditor(changedFiles("window.onDidChangeActiveTextEditor"));

      return;
    }

    if (!this._fileFilters?.useCurrentEditors) {
      // Fired when folders are added/removed from the workspace.
      workspace.onDidChangeWorkspaceFolders(changedFiles("workspace.onDidChangeWorkspaceFolders"));

      return;
    }
  }

  public receiveMessage(webviewMessage: WebviewMessage): void {
    this._log(LogLevel.trace, `Received message: webviewMessage=${JSON.stringify(webviewMessage)}`);

    switch (webviewMessage.command) {
      case "DISPLAY_INFORMATION_MESSAGE":
        window.showInformationMessage(webviewMessage.payload);
        this.postMessage({
          type: "SEND_LOG",
          payload: webviewMessage.payload,
        });
        return;

      case "GET_FILE_CHANGES":
        this._fileFilters = webviewMessage.payload;
        this._subscribeChanges();
        this._setFiles();
        return;
    }
  }

  public postMessage(extensionMessage: ExtensionMessage): void {
    this._log(LogLevel.trace, `Post message: extensionMessage=${JSON.stringify(extensionMessage)}`);

    this._webview.postMessage(extensionMessage);
  }

  public dispose(): void {
    this._log(LogLevel.trace, "Dispose");

    this._subscriptions.forEach((disposable) => disposable.dispose());
    this._subscriptions = [];
  }
}

export default SerialReplacer;
