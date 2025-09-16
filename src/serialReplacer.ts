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
  commands,
} from "vscode";
import { basename, join } from "path";
import { filterFileByLists, splitOutsideCurlyBraces } from "./aux";
import { getStats } from "shared/common";
import { emptyHistory, emptyPersistentData, emptyReplacementParameters } from "shared/data";
import config from "./config.json";

import type { WebviewMessage, ExtensionMessage } from "shared/messages";
import type {
  WorkspacesAndFiles,
  ReplacementResults,
  FilePath,
  ReplacementParameters,
  PersistentData,
  PersistentHistory,
  HistoryAwareField,
} from "shared/replacements";

const { t, bundle } = l10n;

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
  private _replacementResults: ReplacementResults = {};
  private _subscriptions: Disposable[] = [];
  private _openDiffs: Map<string, { left: Uri; right: Uri }> = new Map();

  constructor(
    private readonly extensionContext: ExtensionContext,
    private readonly webview: Webview,
    private readonly tag: string
  ) {
    this._context = extensionContext;
    this._webview = webview;
    this._outputChannel = window.createOutputChannel(`${t("Serial Replacer")}: ${tag}`, "log");

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
    const preferenceLevel = LogLevel[config.extensionLogLevel as LogLevels];
    if (!force && (preferenceLevel < level || preferenceLevel === LogLevel.silent || level === 0)) {
      return;
    }
    this._outputChannel.appendLine(
      `[${new Date().toISOString()}] ${LogLevel[level].toUpperCase()} ${((msg, maxSize) =>
        msg.length > maxSize ? `${msg.slice(0, maxSize)}… (truncated)` : msg)(
        message,
        config.maxLogMessageSize
      )}`
    );
  }

  private _getReplacements() {
    return this._replacementParameters.steps
      .filter((step) => step.enabled)
      .map((step) => {
        const {
          id,
          find: { regExp, content, caseSensitive },
          replace: { content: replacement },
        } = step;

        const re = new RegExp(
          content === ""
            ? "(?!)" // empty find will look for nothing
            : regExp // if regular expression toggled…
            ? content // …literal regular expression given by user
            : content.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // …otherwise plain text escaped
          `gm${caseSensitive ? "" : "i"}`
        );
        return { id, re, replacement };
      });
  }

  private async _replaceContents(file: FilePath) {
    const uri = Uri.file(file);

    // TODO: error handling
    let text = Buffer.from(await workspace.fs.readFile(uri)).toString("utf8");

    const replacements = this._getReplacements();
    for (const replacement of replacements) {
      text = text.replace(replacement.re, replacement.replacement);
    }

    return text;
  }

  private async _replace(commit = false): Promise<ReplacementResults> {
    this._log(LogLevel.trace, `Replace commit=${JSON.stringify(commit)}`);

    const replacementResults: ReplacementResults = {};

    const replacements = this._getReplacements();
    this._log(
      LogLevel.debug,
      `replacements=${JSON.stringify(replacements.map((r) => ({ ...r, re: r.re.toString() })))}`
    );

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
            text = text.replace(replacement.re, replacement.replacement);
          }
        }

        if (commit) {
          await workspace.fs.writeFile(uri, Buffer.from(text, "utf8"));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          replacementResults[file].errors.push(
            JSON.stringify({
              name: error.name,
              message: error.message,
              stack: error.stack,
            })
          );
        } else {
          replacementResults[file].errors.push(String(error)); // wrap non-Error values
        }
      }
    }

    this._replacementResults = replacementResults;
    return replacementResults;
  }

  private async _replaceAll() {
    this._log(LogLevel.trace, `Replace all`);

    const results = await this._replace(true);
    this._log(LogLevel.debug, `results=${JSON.stringify(results)}`);

    const stats = getStats(results);
    this._log(LogLevel.debug, `stats=${JSON.stringify(stats)}`);

    const replacementsMessage = `${t("{0} replacements", stats.replacementsMade)} ${t(
      "made in {0} files",
      stats.filesReplaced
    )}`;

    if (!stats.errors) {
      if (stats.replacementsMade === 0) {
        window.showInformationMessage(t("No replacements"));
        return;
      }

      window.showInformationMessage(replacementsMessage);
      return;
    }

    const errors: [FilePath, string[]][] = Object.entries(results)
      .filter(([, { errors }]) => errors.length > 0)
      .map(([filePath, { errors }]) => [filePath, errors]);
    this._log(LogLevel.error, `errors=${JSON.stringify(errors)}`);

    const errorMessage = t(`and {0} errors`, stats.errors);

    const choice = await window.showErrorMessage(
      `${replacementsMessage} ${errorMessage}`,
      t("Details…")
    );

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

    this._previewCount();
  }

  private async _previewCount() {
    this._log(LogLevel.trace, `Preview count`);

    const results = await this._replace(false);
    this._log(LogLevel.debug, `results=${JSON.stringify(results)}`);

    this.postMessage({
      type: "SET_PREVIEW",
      payload: results,
    });

    await this._updatePreviews();
  }

  private async _openPreview(filePath: FilePath, updateOnly = false) {
    this._log(LogLevel.trace, `Open preview filePath=${JSON.stringify(filePath)}`);

    if (filePath in this._replacementResults) {
      const replacements = this._replacementResults[filePath].replacements;
      if (replacements) {
        this._log(LogLevel.trace, "Will open diff editor");

        const previewContent = await this._replaceContents(filePath);
        this._log(LogLevel.debug, `previewContent=${JSON.stringify(previewContent)}`);

        this._log(
          LogLevel.debug,
          `this._openDiffs=${JSON.stringify(
            Array.from(this._openDiffs).reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {} as Record<string, any>)
          )}`
        );
        const openDiff = this._openDiffs.get(filePath);
        this._log(LogLevel.debug, `openDiff=${JSON.stringify(openDiff)}`);

        if (!openDiff) {
          if (!updateOnly) {
            this._log(LogLevel.trace, "Will create preview");
            const leftUri = Uri.file(filePath);
            const rightDoc = await workspace.openTextDocument({
              content: previewContent,
              language: "plaintext",
            });
            const rightUri = rightDoc.uri;

            await commands.executeCommand(
              "vscode.diff",
              leftUri,
              rightUri,
              `Preview: ${basename(filePath)}`,
              { preview: false, preserveFocus: false }
            );

            this._openDiffs.set(filePath, { left: leftUri, right: rightUri });
            this._log(LogLevel.trace, "Preview created");
          }
          return;
        }

        const doc = workspace.textDocuments.find(
          (textDocument) => textDocument.uri.toString() === openDiff.right.toString()
        );

        if (!doc) {
          this._log(LogLevel.trace, "Preview not found: remove from list");
          this._openDiffs.delete(filePath);
          return;
        }

        this._log(LogLevel.trace, "Will update preview");
        const edit = new WorkspaceEdit();
        edit.replace(
          doc.uri,
          new Range(doc.positionAt(0), doc.positionAt(doc.getText().length)),
          previewContent
        );
        await workspace.applyEdit(edit);

        if (!updateOnly) {
          await commands.executeCommand(
            "vscode.diff",
            openDiff.left,
            openDiff.right,
            `Preview: ${basename(filePath)}`,
            { preview: false, preserveFocus: false }
          );
        }

        this._log(LogLevel.trace, `Preview updated`);
        return;
      }
    }

    if (!updateOnly) {
      this._log(LogLevel.trace, "Will show current file without replacements");
      const openEditor = window.visibleTextEditors.find((editor) => {
        return editor.document.uri.fsPath === filePath;
      });

      if (openEditor) {
        this._log(LogLevel.trace, "File is open, just reveal it (focus)");
        await window.showTextDocument(openEditor.document, { preserveFocus: false });
        this._log(LogLevel.trace, "Opened document focused");
        return;
      }

      try {
        this._log(LogLevel.trace, "Will open file in new editor tab");
        const document = await workspace.openTextDocument(Uri.file(filePath));
        await window.showTextDocument(document, { preview: true, preserveFocus: false });
        this._log(LogLevel.trace, "File opened");
        return;
      } catch (err) {
        // This is part of UX, do not remove this log line
        this._log(LogLevel.error, `Details:\n${String(err)}`, true);
        const choice = await window.showErrorMessage(`${t("Failed to open file")}`, t("Details…"));
        if (choice === t("Details…")) {
          this._outputChannel.show(true);
        }
      }
    }
  }

  private async _updatePreviews() {
    this._log(LogLevel.trace, `Update previews`);

    for (const [key] of this._openDiffs) {
      this._log(LogLevel.trace, `key=${JSON.stringify(key)}`);
      this._openPreview(key, true);
    }
  }

  private _getPersistentData(): PersistentData {
    return this._context.globalState.get("data", emptyPersistentData());
  }

  private _savePersistentData(persistData: PersistentData) {
    this._log(LogLevel.trace, `Save persistent data`);
    this._context.globalState.update("data", persistData);
  }

  private _addToPersistentHistory(
    field: HistoryAwareField,
    value: string,
  ) {
    this._log(LogLevel.trace, `Add to persistent history`);
    this._log(LogLevel.debug, `field=${JSON.stringify(field)}`);
    this._log(LogLevel.debug, `value=${JSON.stringify(value)}`);

    const data = this._getPersistentData();
    this._log(LogLevel.debug, `Original; data=${JSON.stringify(data)}`);

    const fieldHistory = data.history[field];
    const maxFieldHistoryEntries = config.maxFieldHistoryEntries;
    if (value !== '' && fieldHistory[fieldHistory.length - 1] !== value) {
      fieldHistory.push(value);
      if (fieldHistory.length > maxFieldHistoryEntries) {
        fieldHistory.splice(0, fieldHistory.length - maxFieldHistoryEntries);
      }
    }

    this._log(LogLevel.debug, `Updated; data=${JSON.stringify(data)}`);
    this._savePersistentData(data);
  }

  private _persistReplacementParameters(replacementParameters: ReplacementParameters) {
    // TODO: save serial replacer parameters on UI so it can be restored at restart

    // const data = this._getPersistentData();
    //...
    // this._savePersistentData(data);
  }

  private _subscribeChanges() {
    this._log(LogLevel.trace, "Subscribe changes");

    this.dispose();

    const subscriptionListener = (scope: string) => () => {
      this._log(LogLevel.debug, `Subscription listener: scope=${JSON.stringify(scope)}`);
      this._setFiles();
    };

    this._subscriptions.push(
      workspace.onDidChangeConfiguration(
        subscriptionListener("workspace.onDidChangeConfiguration")
      ),
      workspace.onDidRenameFiles(subscriptionListener("workspace.onDidRenameFiles")),
      workspace.onDidDeleteFiles(subscriptionListener("workspace.onDidDeleteFiles")),
      workspace.onDidCreateFiles(subscriptionListener("workspace.onDidCreateFiles")),
      workspace.onDidSaveTextDocument(subscriptionListener("workspace.onDidSaveTextDocument"))
    );

    if (this._replacementParameters.useCurrentEditors) {
      this._subscriptions.push(
        workspace.onDidOpenTextDocument(subscriptionListener("workspace.onDidOpenTextDocument")),
        workspace.onDidCloseTextDocument(subscriptionListener("workspace.onDidCloseTextDocument"))
      );
      return;
    }

    this._subscriptions.push(
      workspace.onDidChangeWorkspaceFolders(
        subscriptionListener("workspace.onDidChangeWorkspaceFolders")
      )
    );

    const watcher = workspace.createFileSystemWatcher("**/*");
    this._subscriptions.push(
      watcher,
      watcher.onDidCreate(subscriptionListener("watcher.onDidCreate")),
      watcher.onDidDelete(subscriptionListener("watcher.onDidDelete")),
      watcher.onDidChange(subscriptionListener("watcher.onDidChange"))
    );
  }

  public async receiveMessage(webviewMessage: WebviewMessage): Promise<void> {
    this._log(LogLevel.trace, `Received message: webviewMessage=${JSON.stringify(webviewMessage)}`);

    switch (webviewMessage.command) {
      case "SUBSCRIBE_CHANGES": {
        this._replacementParameters.useCurrentEditors = webviewMessage.payload;
        this._subscribeChanges();
        return;
      }

      case "SET_REPLACEMENT_PARAMETERS": {
        this._replacementParameters = webviewMessage.payload;
        this._log(
          LogLevel.debug,
          `replacementParameters=${JSON.stringify(this._replacementParameters)}`
        );
        this._setFiles();
        return;
      }

      case "ADD_FIELD_HISTORY": {
        this._addToPersistentHistory(
          webviewMessage.payload.field,
          webviewMessage.payload.value,
        );

        // TODO: post to webview updated history
        //...

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

      case "OPEN_PREVIEW": {
        this._openPreview(webviewMessage.payload);
        return;
      }

      case "REPLACE_ALL": {
        this._setFiles(); // update files prior replacement; avoid deleted files to throw error
        this._replaceAll();
        return;
      }

      case "DISPLAY_INFORMATION_MESSAGE": {
        window.showInformationMessage(webviewMessage.payload);
        this.postMessage({
          type: "SEND_LOG",
          payload: webviewMessage.payload,
        });
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
