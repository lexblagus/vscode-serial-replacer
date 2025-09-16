import type { TreeItem } from "../../../shared/tree";
import type { ReplacementResults } from "../../../shared/replacements";

export type RESET = "RESET";
export type SET_FILES_TO_INCLUDE = "SET_FILES_TO_INCLUDE";
export type SET_FILES_TO_EXCLUDE = "SET_FILES_TO_EXCLUDE";
export type SET_USE_CURRENT_EDITORS = "SET_USE_CURRENT_EDITORS";
export type SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES = "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES";
export type SET_TREE_PREVIEW = "SET_TREE_PREVIEW";
export type SET_FILE_TREE = "SET_FILE_TREE";
export type SET_TREE_ITEM_VISIBILITY = "SET_TREE_ITEM_VISIBILITY";
export type SET_TREE_ITEM_VISIBILITY_RECURSIVELY = "SET_TREE_ITEM_VISIBILITY_RECURSIVELY";
export type SET_STEP_EXPANDED = "SET_STEP_EXPANDED";
export type SET_STEP_FIND = "SET_STEP_FIND";
export type SET_STEP_REPLACE = "SET_STEP_REPLACE";
export type SET_STEP_TITLE = "SET_STEP_TITLE";
export type SET_STEP_POSITION = "SET_STEP_POSITION";
export type ADD_STEP = "ADD_STEP";
export type SET_STEP_ENABLED = "SET_STEP_ENABLED";
export type REMOVE_STEP = "REMOVE_STEP";
export type SET_STEP_FIND_REGEXP = "SET_STEP_FIND_REGEXP";
export type SET_STEP_FIND_CASE_SENSITIVE = "SET_STEP_FIND_CASE_SENSITIVE";
export type SET_STEP_FIND_WORD_WRAP = "SET_STEP_FIND_WORD_WRAP";
export type SET_STEP_REPLACE_WORD_WRAP = "SET_STEP_REPLACE_WORD_WRAP";

type MainAction = {
  type: RESET;
};

type FileFiltersAction =
  | { type: SET_FILES_TO_INCLUDE; payload: string }
  | { type: SET_FILES_TO_EXCLUDE; payload: string }
  | { type: SET_USE_CURRENT_EDITORS; payload: boolean }
  | { type: SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES; payload: boolean }
  | {
      type: SET_TREE_PREVIEW;
      payload: ReplacementResults;
    }
  | {
      type: SET_FILE_TREE;
      payload: {
        tree: TreeItem[];
        quantity: number;
      };
    }
  | {
      type: SET_TREE_ITEM_VISIBILITY;
      payload: {
        open: boolean;
        path: number[];
      };
    }
  | {
      type: SET_TREE_ITEM_VISIBILITY_RECURSIVELY;
      payload: {
        open: boolean;
        path: number[];
      };
    };

type StepActions =
  | {
      type: SET_STEP_EXPANDED;
      payload: {
        index: number;
        expanded: boolean;
      };
    }
  | {
      type: SET_STEP_FIND;
      payload: {
        index: number;
        find: {
          content: string;
        };
      };
    }
  | {
      type: SET_STEP_REPLACE;
      payload: {
        index: number;
        replace: {
          content: string;
        };
      };
    };

type StepContextualAction =
  | {
      type: SET_STEP_TITLE;
      payload: {
        id: string;
        title: string | undefined;
      };
    }
  | {
      type: SET_STEP_POSITION;
      payload: {
        index: number;
        position: number;
      };
    }
  | {
      type: ADD_STEP;
      payload: {
        index: number;
        position: number;
      };
    }
  | {
      type: SET_STEP_ENABLED;
      payload: {
        index: number;
        enabled: boolean;
      };
    }
  | {
      type: REMOVE_STEP;
      payload: {
        index: number;
      };
    };

type StepFindContextualAction =
  | {
      type: SET_STEP_FIND_REGEXP;
      payload: {
        index: number;
        find: {
          regExp: boolean;
        };
      };
    }
  | {
      type: SET_STEP_FIND_CASE_SENSITIVE;
      payload: {
        index: number;
        find: {
          caseSensitive: boolean;
        };
      };
    }
  | {
      type: SET_STEP_FIND_WORD_WRAP;
      payload: {
        index: number;
        find: {
          wordWrap: boolean;
        };
      };
    };

type StepReplaceContextualAction = {
  type: SET_STEP_REPLACE_WORD_WRAP;
  payload: {
    index: number;
    replace: {
      wordWrap: boolean;
    };
  };
};

export type AppAction =
  | MainAction
  | FileFiltersAction
  | StepActions
  | StepContextualAction
  | StepFindContextualAction
  | StepReplaceContextualAction;
