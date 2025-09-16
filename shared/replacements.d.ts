import type { TreeItem } from "./tree";

export interface Step {
  id: string;
  title?: string;
  enabled: boolean;
  expanded: boolean;
  find: {
    content: string;
    regExp: boolean;
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

export interface ReplacementParameters extends FileFilters {
  steps: Step[];
}

export interface SerialReplacement extends ReplacementParameters {
  id: string;
  results: TreeItem[];
  resultsTotalFiles: number;
}

export type FilePath = string;

export type PathList = FilePath[];

export type WorkspacesAndFiles<T = PathList> = {
  workspaces: T;
  files: T;
};

export type ReplacementResults = Record<
  FilePath,
  {
    errors: string[];
    replacements: number;
  }
>;

export type HistoryAwareField = 'includeFiles' | 'excludeFiles' | 'findContent' | 'replaceContent';

export type PersistentHistory = Record<HistoryAwareField, string[]>;

export type PersistentData = {
  replacementParameters: ReplacementParameters;
  history: PersistentHistory;
};
