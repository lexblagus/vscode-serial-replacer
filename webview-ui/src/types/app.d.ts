import { TreeItem } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";

export interface Step {
  id: string;
  title?: string;
  enabled: boolean;
  expanded: boolean;
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
  id: string;
  includeFiles: string;
  useCurrentEditor: boolean;
  excludeFiles: string;
  useExcludeSettingsAndIgnoreFiles: boolean;
  results: TreeItem[];
  resultsTotalFiles: Number;
  steps: Step[];
}
