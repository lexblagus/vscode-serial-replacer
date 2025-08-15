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
import { join } from "path";
import { filterFileByLists, splitOutsideCurlyBraces } from "./aux";
import prefs from "./prefs.json";
import type { FileFilters } from "webview-ui/src/types/replacers";
import type { WebviewMessage, ExtensionMessage, WorkspacesAndFiles } from "./types";

const { bundle } = l10n;

enum LogLevel {
  silent = 0,
  fatal = 1,
  error = 2,
  warn = 3,
  info = 4,
  debug = 5,
  trace = 6,
}

type LogLevels = keyof typeof LogLevel;

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
    this._outputChannel = window.createOutputChannel(`Serial Replacer ${tag}`, "log");
    this._fileFilters = null;

    this._log(LogLevel.info, `Serial Replacer ${tag} initialized`);

    /*
    this._log(LogLevel.silent, 'silent');
    this._log(LogLevel.fatal, 'fatal');
    this._log(LogLevel.error, 'error');
    this._log(LogLevel.warn, 'warn');
    this._log(LogLevel.info, 'info');
    this._log(LogLevel.debug, 'debug');
    this._log(LogLevel.trace, 'trace');
    */
  }

  private _log(level: LogLevel, message: string) {
    const preferenceLevel = LogLevel[prefs.extensionLogLevel as LogLevels];
    if (preferenceLevel < level || preferenceLevel === LogLevel.silent || level === 0) {
      return;
    }
    this._outputChannel.appendLine(
      `[${new Date().toISOString()}] ${LogLevel[level].toUpperCase()} ${((msg, maxSize) =>
        msg.length > maxSize ? `${msg.slice(0, maxSize)}… (truncated)` : msg)(
        message,
        prefs.maxLogMessageSize
      )}\n`
    );
  }

  private async _setFiles() {
    this._log(LogLevel.trace, `Set files: fileFilters=${JSON.stringify(this._fileFilters)}`);

    if (!this._fileFilters) {
      return;
    }

    const selectedFiles: WorkspacesAndFiles = {
      workspaces: [],
      files: [],
    };

    for (const workspaceFolder of workspace.workspaceFolders ?? []) {
      selectedFiles.workspaces.push(workspaceFolder.uri.fsPath);
    }

    const subFolderGlobRegExp = new RegExp("\\*\\*|\\/");

    const formatSinglePattern = (p: string) => (subFolderGlobRegExp.test(p) ? p : `**/${p}`); // '**' or '/'

    const formatFilesList = (patternsList: string): string[] =>
      splitOutsideCurlyBraces(patternsList).map((pattern) => formatSinglePattern(pattern));

    const includeFilesList = formatFilesList(this._fileFilters?.includeFiles);

    const uiExcludeFilesList = formatFilesList(this._fileFilters?.excludeFiles);

    /*
    Includes:
    - default global settings (VSCode internals);
    - user global settings (settings.json);
    - .code-workspace file settings (.code-workspace settings['search.exclude']).
    Always filled
    */
    const globalExcludeList: string[] = [];

    /*
    Includes (for each workspace folder):
    - default global settings (VSCode internals);
    - user global settings (settings.json);
    - .code-workspace file settings['search.exclude']);
    - .vscode/settings file settings['search.exclude'];
    Empty with no workspace loaded
    */
    const workspaceFolderExcludeList: string[] = [];

    if (this._fileFilters?.useExcludeSettingsAndIgnoreFiles) {
      const globalConfig = workspace.getConfiguration("search");
      const globalExclude = globalConfig.get<Record<string, boolean>>("exclude") ?? {};
      for (const [pattern, active] of Object.entries(globalExclude)) {
        if (active) {
          globalExcludeList.push(pattern);
        }
      }

      const folders = workspace.workspaceFolders;
      if (folders && folders.length > 0) {
        for (const folder of folders) {
          const folderConfig = workspace.getConfiguration("search", folder.uri);
          const folderExclude = folderConfig.get<Record<string, boolean>>("exclude") ?? {};
          for (const [pattern, active] of Object.entries(folderExclude)) {
            if (active) {
              const fullPattern = join(folder.uri.fsPath, pattern);
              workspaceFolderExcludeList.push(fullPattern);
            }
          }
        }
      }
    }

    const excludeFilesList = [
      ...globalExcludeList,
      ...workspaceFolderExcludeList,
      ...uiExcludeFilesList,
    ].map((pattern) => formatSinglePattern(pattern));

    this._log(
      LogLevel.trace,
      `File lists: includeFilesList=${JSON.stringify(
        includeFilesList
      )}; excludeFilesList=${JSON.stringify(excludeFilesList)}`
    );

    if (this._fileFilters.useCurrentEditors) {
      for (const tabGroup of window.tabGroups.all) {
        for (const tab of tabGroup.tabs) {
          if (tab.input instanceof TabInputText) {
            const currentFilePath = filterFileByLists(
              tab.input.uri.fsPath,
              includeFilesList,
              excludeFilesList
            );
            if (!currentFilePath) {
              continue;
            }
            selectedFiles.files.push(currentFilePath);
          }
        }
      }
    }

    if (!this._fileFilters.useCurrentEditors) {
      const workspaceFiles = await workspace.findFiles("**/*");
      for (const workspaceFile of workspaceFiles) {
        const currentFilePath = filterFileByLists(
          workspaceFile.fsPath,
          includeFilesList,
          excludeFilesList
        );
        if (!currentFilePath) {
          continue;
        }
        selectedFiles.files.push(currentFilePath);
      }
    }

    this._log(LogLevel.debug, `Selected files: selectedFiles=${JSON.stringify(selectedFiles)}`);

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
