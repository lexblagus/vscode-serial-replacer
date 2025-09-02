import {
  Disposable,
  ExtensionContext,
  l10n,
  OutputChannel,
  TabInputText,
  Uri,
  Webview,
  window,
  workspace,
  WorkspaceEdit,
  Range,
} from "vscode";
import { join } from "path";
import { filterFileByLists, splitOutsideCurlyBraces } from "./aux";
import prefs from "./prefs.json";
const { t } = l10n;
import type {
  WebviewMessage,
  ExtensionMessage,
  WorkspacesAndFiles,
  ReplacementResults,
  FilePath,
} from "./types";
import type { ReplacementParameters, Step } from "webview-ui/src/types/replacers";

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

const s = "  "; // log space indent

export class SerialReplacer {
  private readonly _context: ExtensionContext;
  private readonly _webview: Webview;
  private readonly _tag: string;
  private readonly _outputChannel: OutputChannel;
  private _replacementParameters: ReplacementParameters = {
    includeFiles: "",
    useCurrentEditors: true,
    excludeFiles: "",
    useExcludeSettingsAndIgnoreFiles: true,
    steps: [],
  };
  private _workspacesAndFiles: WorkspacesAndFiles = {
    files: [],
    workspaces: [],
  };
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

    this._log(LogLevel.info, `Serial Replacer ${tag} initialized`);

    /*
    this._log(LogLevel.silent, 'silent');
    this._log(LogLevel.fatal, 'fatal');
    this._log(LogLevel.error, 'error');
    this._log(LogLevel.warn, 'warn');
    this._log(LogLevel.info, 'info');
    this._log(LogLevel.debug, 'debug'); // usually constants/variables inside methods
    this._log(LogLevel.trace, 'trace'); // usually method/function
    */
  }

  private _log(level: LogLevel, message: string, force = false) {
    const preferenceLevel = LogLevel[prefs.extensionLogLevel as LogLevels];
    if (!force && (preferenceLevel < level || preferenceLevel === LogLevel.silent || level === 0)) {
      return;
    }
    this._outputChannel.appendLine(
      `[${new Date().toISOString()}] ${LogLevel[level].toUpperCase()} ${((msg, maxSize) =>
        msg.length > maxSize ? `${msg.slice(0, maxSize)}… (truncated)` : msg)(
        message,
        prefs.maxLogMessageSize
      )}`
    );
  }

  private async _replace(commit = false): Promise<ReplacementResults> {
    this._log(LogLevel.trace, `Replace commit=${JSON.stringify(commit)}`);

    const replacementResults: ReplacementResults = {};

    const replacements = this._replacementParameters.steps
      .filter((step) => step.enabled)
      .map((step) => {
        const {
          id,
          find: { regExp, content, global, caseSensitive, multiline },
          replace: { content: replacement },
        } = step;

        const re = new RegExp(
          content === ""
            ? "(?!)" // empty find will look for nothing
            : regExp // if regular expression toggled…
            ? content // …literal regular expression given by user
            : content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // …otherwise plain text escaped
          `${global ? "g" : ""}${caseSensitive ? "" : "i"}${multiline ? "m" : ""}`
        );
        return { id, re, replacement };
      });

    for (const file of this._workspacesAndFiles.files) {
      replacementResults[file] = { replacements: 0, errors: [] };

      try {
        const uri = Uri.file(file);

        let text = Buffer.from(await workspace.fs.readFile(uri)).toString("utf8");

        for (const replacement of replacements) {
          const matches = text.match(replacement.re);
          if (matches) {
            replacementResults[file].replacements =
              replacementResults[file].replacements + matches.length;
          }
          text = text.replace(replacement.re, replacement.replacement);
        }

        if (commit) {
          await workspace.fs.writeFile(uri, Buffer.from(text, "utf8"));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          replacementResults[file].errors.push(error); // has .message, .stack, etc.
        } else {
          replacementResults[file].errors.push(new Error(String(error))); // wrap non-Error values
        }
      }
    }

    return replacementResults;
  }

  private async _previewCount() {
    this._log(LogLevel.trace, `Preview count`);

    const results = await this._replace(false);
    this._log(LogLevel.debug, `results=${JSON.stringify(results)}`);
    // ...
  }

  private async _replaceAll() {
    this._log(LogLevel.trace, `Replace all`);

    const results = await this._replace(true);
    this._log(LogLevel.debug, `results=${JSON.stringify(results)}`);

    const stats = Object.values(results).reduce(
      (acc, result) => {
        return {
          totalFiles: acc.totalFiles + 1,
          filesReplaced: acc.filesReplaced + (result.replacements ? 1 : 0),
          replacementsMade: acc.replacementsMade + result.replacements,
          errors: acc.errors + result.errors.length,
        };
      },
      {
        totalFiles: 0,
        filesReplaced: 0,
        replacementsMade: 0,
        errors: 0,
      }
    );
    this._log(LogLevel.debug, `stats=${JSON.stringify(stats)}`);

    const succesMessage = t(
      `{0} replacements made in {1} files`,
      stats.replacementsMade,
      stats.filesReplaced
    );

    if (!stats.errors) {
      if (stats.replacementsMade === 0) {
        window.showInformationMessage(t("No replacements"));
        return;
      }

      window.showInformationMessage(succesMessage);
      return;
    }

    const errors: [FilePath, Error[]][] = Object.entries(results)
      .filter(([, { errors }]) => errors.length > 0)
      .map(([filePath, { errors }]) => [filePath, errors]);
    this._log(LogLevel.error, `errors=${JSON.stringify(errors)}`);

    const errorMessage = t(`and {0} errors`, stats.errors);

    const choice = await window.showErrorMessage(`${succesMessage} ${errorMessage}`, t("Details…"));

    if (choice === t("Details…")) {
      const details = errors
        .map(
          (fileAndErrors) =>
            `${s}${fileAndErrors[0]}:\n${fileAndErrors[1]
              .map((e) => `${s}${s}${JSON.stringify(e)}`)
              .join("\n")}`
        )
        .join("\n");
      // This is part of UX, do not remove this log line
      this._log(LogLevel.error, `Details:\n${details}`, true);
      this._outputChannel.show(true);
    }
  }

  private async _setFiles() {
    this._log(LogLevel.trace, `Set files`);

    const workspacesAndFiles: WorkspacesAndFiles = {
      workspaces: [],
      files: [],
    };

    for (const workspaceFolder of workspace.workspaceFolders ?? []) {
      workspacesAndFiles.workspaces.push(workspaceFolder.uri.fsPath);
    }

    const subFolderGlobRegExp = new RegExp("\\*\\*|\\/");

    const formatSinglePattern = (p: string) => (subFolderGlobRegExp.test(p) ? p : `**/${p}`); // '**' or '/'

    const formatFilesList = (patternsList: string): string[] =>
      splitOutsideCurlyBraces(patternsList).map((pattern) => formatSinglePattern(pattern));

    const includeFilesList = formatFilesList(this._replacementParameters.includeFiles);

    const uiExcludeFilesList = formatFilesList(this._replacementParameters.excludeFiles);

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

    if (this._replacementParameters.useExcludeSettingsAndIgnoreFiles) {
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

    this._log(
      LogLevel.debug,
      `includeFilesList=${JSON.stringify(includeFilesList)}; globalExcludeList=${JSON.stringify(
        globalExcludeList
      )}; workspaceFolderExcludeList=${JSON.stringify(
        workspaceFolderExcludeList
      )}; uiExcludeFilesList=${JSON.stringify(uiExcludeFilesList)}`
    );

    const excludeFilesList = [
      ...globalExcludeList,
      ...workspaceFolderExcludeList,
      ...uiExcludeFilesList,
    ].map((pattern) => formatSinglePattern(pattern));

    if (this._replacementParameters.useCurrentEditors) {
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
            workspacesAndFiles.files.push(currentFilePath);
          }
        }
      }
    }

    if (!this._replacementParameters.useCurrentEditors) {
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
        workspacesAndFiles.files.push(currentFilePath);
      }
    }

    this._log(LogLevel.debug, `workspacesAndFiles=${JSON.stringify(workspacesAndFiles)}`);
    this._workspacesAndFiles = workspacesAndFiles;
    this.postMessage({
      type: "SET_WORKSPACES_FILES",
      payload: this._workspacesAndFiles,
    });
  }

  private _subscribeChanges() {
    this._log(LogLevel.trace, "Subscribe changes");

    this.dispose();

    const subscriptionListener = (scope: string) => () => {
      this._log(LogLevel.debug, `Subscription listener: scope=${JSON.stringify(scope)}`);
      this._setFiles();
    };

    workspace.onDidChangeConfiguration(subscriptionListener("workspace.onDidChangeConfiguration"));
    workspace.onDidRenameFiles(subscriptionListener("workspace.onDidRenameFiles"));
    workspace.onDidDeleteFiles(subscriptionListener("workspace.onDidDeleteFiles"));
    workspace.onDidCreateFiles(subscriptionListener("workspace.onDidCreateFiles"));
    workspace.onDidSaveTextDocument(subscriptionListener("workspace.onDidSaveTextDocument"));

    if (this._replacementParameters.useCurrentEditors) {
      workspace.onDidOpenTextDocument(subscriptionListener("workspace.onDidOpenTextDocument"));
      workspace.onDidCloseTextDocument(subscriptionListener("workspace.onDidCloseTextDocument"));
      return;
    }

    workspace.onDidChangeWorkspaceFolders(
      subscriptionListener("workspace.onDidChangeWorkspaceFolders")
    );

    const watcher = workspace.createFileSystemWatcher("**/*");
    watcher.onDidCreate(subscriptionListener("watcher.onDidCreate"));
    watcher.onDidDelete(subscriptionListener("watcher.onDidDelete"));
    watcher.onDidChange(subscriptionListener("watcher.onDidChange"));
  }

  public async receiveMessage(webviewMessage: WebviewMessage): Promise<void> {
    this._log(LogLevel.trace, `Received message: webviewMessage=${JSON.stringify(webviewMessage)}`);

    switch (webviewMessage.command) {
      case "DISPLAY_INFORMATION_MESSAGE": {
        window.showInformationMessage(webviewMessage.payload);
        this.postMessage({
          type: "SEND_LOG",
          payload: webviewMessage.payload,
        });
        return;
      }

      case "PROMPT_RENAME": {
        const { id, index, title } = webviewMessage.payload;
        const autoTitle = t("Step {0}", index + 1);
        const newTitle = await window.showInputBox({
          title: `${t("Rename")} '${title || autoTitle}'`,
          prompt:
            t("Enter new name") +
            ". " +
            t("Leave empty to name it automatically, like '{0}'", autoTitle) +
            ". " +
            t(
              "If you explicitly name it '{0}', it will persist even when you change the step order",
              autoTitle
            ) +
            ".",
          value: title,
          ignoreFocusOut: false,
        });
        if (newTitle !== undefined) {
          // if use did not cancel
          this.postMessage({
            type: "COMMIT_RENAME",
            payload: {
              id,
              title: newTitle || undefined, // if user choosed auto title
            },
          });
        }
        return;
      }

      case "CONFIRM_RESET": {
        if (
          (await window.showWarningMessage(
            t("Are you sure you want to reset files and steps?"),
            { modal: true },
            t("Yes")
          )) === t("Yes")
        ) {
          this.postMessage({
            type: "COMMIT_RESET",
          });
        }
        return;
      }

      case "SUBSCRIBE_CHANGES": {
        this._replacementParameters.useCurrentEditors = webviewMessage.payload;
        this._subscribeChanges();
        return;
      }

      case "SET_REPLACEMENT PARAMETERS": {
        this._replacementParameters = webviewMessage.payload;
        this._log(
          LogLevel.debug,
          `replacementParameters=${JSON.stringify(this._replacementParameters)}`
        );
        this._setFiles();
        this._previewCount();
        return;
      }

      case "GET_PREVIEW_COUNT": {
        this._replacementParameters.steps = webviewMessage.payload;
        this._log(LogLevel.debug, `steps=${JSON.stringify(this._replacementParameters.steps)}`);
        this._previewCount();
        return;
      }

      case "REPLACE_ALL": {
        this._setFiles(); // update files prior replacement; avoid deleted files to throw error
        this._replaceAll();
        return;
      }
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
