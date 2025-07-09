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
import { WebviewMessage, ExtensionMessage } from "./types";
import { basename } from "path";
import type { FileFilters } from "webview-ui/src/types/replacers";
import type { TreeItem } from "webview-ui/src/types/tree";

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
  private readonly _webview: Webview;
  private _context: ExtensionContext;
  private _outputChannel: OutputChannel;
  private _fileFilters: FileFilters | null;
  private _subscriptions: Disposable[] = [];

  constructor(
    private readonly extensionContext: ExtensionContext,
    private readonly webview: Webview
  ) {
    this._context = extensionContext;
    this._webview = webview;
    this._outputChannel = window.createOutputChannel("Serial Replacer");
    this._fileFilters = null;

    this._log(LogLevel.info, `Serial Replacer initialized`);
    /*
    this._log(LogLevel.silent, `silent`);
    this._log(LogLevel.fatal, `fatal`);
    this._log(LogLevel.error, `error`);
    this._log(LogLevel.warn, `warn`);
    this._log(LogLevel.info, `info`);
    this._log(LogLevel.debug, `debug`);
    this._log(LogLevel.trace, `trace`);
    */
  }

  private _log(level: LogLevel, message: string) {
    const configLevel = LogLevel["trace"]; // TODO: put in User Preference
    if (
      configLevel < level ||
      (configLevel as LogLevel) === LogLevel.silent ||
      level === LogLevel.silent
    ) {
      return;
    }
    this._outputChannel.appendLine(`${new Date().toISOString()} [${LogLevel[level]}] ${message}\n`);
  }

  private _changedFiles() {
    this._log(LogLevel.trace, `Changed files: fileFilters=${JSON.stringify(this._fileFilters)}`);

    // TODO: work in progress

    /*
    const editor = window.activeTextEditor;
    const doc = editor?.document;
    const uri = doc?.uri;
    const scheme = uri?.scheme;
    const folder = uri && workspace.getWorkspaceFolder(uri);
    const folders = workspace.workspaceFolders ?? [];
    const fsPath = uri?.fsPath && basename(uri.fsPath);
    const multiRootConfigForResource = workspace.getConfiguration("multiRootSample", uri);
    const color = multiRootConfigForResource.get("statusColor");
    const textDocuments = workspace.textDocuments.filter((item) => item.uri.scheme === "file");
    const visibleTextEditors = window.visibleTextEditors;
    // const tabs = window.tabGroups.all[0].tabs;

    this._log(LogLevel.debug, `editor=${JSON.stringify(editor)}`);
    this._log(LogLevel.debug, `doc=${JSON.stringify(doc)}`);
    this._log(LogLevel.debug, `uri=${JSON.stringify(uri)}`);
    this._log(LogLevel.debug, `scheme=${JSON.stringify(scheme)}`);
    this._log(LogLevel.debug, `folder=${JSON.stringify(folder)}`);
    this._log(LogLevel.debug, `folders=${JSON.stringify(folders)}`);
    this._log(LogLevel.debug, `fsPath=${JSON.stringify(fsPath)}`);
    this._log(LogLevel.debug, `multiRootConfigForResource=${JSON.stringify(multiRootConfigForResource)}`);
    this._log(LogLevel.debug, `color=${JSON.stringify(color)}`);
    this._log(LogLevel.debug, `textDocuments=${JSON.stringify(textDocuments)}`);
    this._log(LogLevel.debug, `visibleTextEditors=${JSON.stringify(visibleTextEditors)}`);
    // this._log(LogLevel.debug, `tabs=${JSON.stringify(tabs)}`);
    */

    /*
    is Workspace
    is useCurrentEditors
    */

    const tree: TreeItem[] = [];


    if (this._fileFilters?.useCurrentEditors) {
      const activeEditors: string[] = [];
      for (const tabGroup of window.tabGroups.all) {
        for (const tab of tabGroup.tabs) {
          if (tab.input instanceof TabInputText) {
            const uri = tab.input.uri;
            const fsPath = uri.fsPath;
            // TODO: apply filters
            activeEditors.push(fsPath);
            tree.push({
              label: basename(fsPath),
              icons: {
                branch: "folder",
                open: "folder-opened",
                leaf: "file",
              },
            });
          }
        }
      }
      this._log(LogLevel.debug, `activeEditors=${JSON.stringify(activeEditors)}`);
    }

    if (!this._fileFilters?.useCurrentEditors) {
      // TODO: read FS tree and add to tree
      const workspaceFolders = [];
      for (const folder of workspace.workspaceFolders ?? []) {
        workspaceFolders.push(folder.uri.fsPath);
        // this._log(LogLevel.trace, `folder.uri.fsPath=${JSON.stringify(folder.uri.fsPath)}`);
        tree.push({
          label: basename(folder.uri.fsPath),
          icons: {
            branch: "folder",
            open: "folder-opened",
            leaf: "folder",
          },
        });
      }
      this._log(LogLevel.trace, `workspaceFolders=${JSON.stringify(workspaceFolders)}`);
      const isWorkspace = tree.length > 0;
      this._log(LogLevel.trace, `isWorkspace=${JSON.stringify(isWorkspace)}`);
    }

    this._log(LogLevel.debug, `tree=${JSON.stringify(tree)}`);

    this.postMessage({
      type: "SET_FILES",
      payload: tree,
    });
    /*

    const sample: TreeItem[] = [
      {
        label: "Folder A",
        subItems: [
          {
            label: "File A1",
          },
        ],
      },
      {
        label: "Folder B",
        subItems: [
          {
            label: "File B1",
          },
          {
            label: "Folder BA",
            subItems: [
              {
                label: "File BA1",
              },
            ],
          },
        ],
      },
    ];

    this.postMessage({
      type: "SET_FILES",
      payload: sample,
    });

    this.postMessage({
      type: "SET_FILES",
      payload: activeEditors,
    });
    */
  }

  private _subscribeChanges() {
    this._log(
      LogLevel.trace,
      `Subscribe to file changes: fileFilters=${JSON.stringify(this._fileFilters)}`
    );

    this.dispose();

    // const changedFiles = this._changedFiles.bind(this);
    const changedFiles = (scope: string) => () => {
      this._log(LogLevel.trace, `File changes: scope=${JSON.stringify(scope)}`);
      this._changedFiles();
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
    window.onDidChangeWindowState(changedFiles("window.onDidChangeWindowState")); // Maybe

    if (this._fileFilters?.useCurrentEditors) {
      // Fired when a text document is opened.
      workspace.onDidOpenTextDocument(changedFiles("workspace.onDidOpenTextDocument"));
      // Fired when a text document is closed.
      workspace.onDidCloseTextDocument(changedFiles("workspace.onDidCloseTextDocument"));
      // Fired when the list of visible editors changes (e.g., split view).
      window.onDidChangeVisibleTextEditors(changedFiles("window.onDidChangeVisibleTextEditors"));
      //Fires when user switches to a different editor (tab)
      window.onDidChangeActiveTextEditor(changedFiles("window.onDidChangeActiveTextEditor"));

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
      /*
      case "INIT":
        // this._subscribeChanges();
        return;
      */

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
        this._changedFiles();
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
