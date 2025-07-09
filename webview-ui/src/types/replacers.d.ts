import type { TreeItem } from "../types/tree";

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

export interface FileFilters {
  includeFiles: string;
  useCurrentEditors: boolean;
  excludeFiles: string;
  useExcludeSettingsAndIgnoreFiles: boolean;
}

export interface SerialReplacement extends FileFilters {
  id: string;
  results: TreeItem[];
  resultsTotalFiles: number;
  steps: Step[];
}
