import { TreeItem } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";

export interface Step {
  expanded: boolean;
  title: string;
  enabled: boolean;
  find: {
    content: string;
    regExp: boolean;
    global: boolean;
    multiline: boolean;
    caseSensitive: boolean;
    wordWrap: boolean;
  };
  replace: {
    content: string;
    wordWrap: boolean;
  };
}

export interface SerialReplacement {
  includeFiles: string;
  useCurrentEditor: boolean;
  excludeFiles: string;
  useExcludeSettingsAndIgnoreFiles: boolean;
  results: TreeItem[];
  resultsTotalFiles: Number;
  steps: Step[];
}
