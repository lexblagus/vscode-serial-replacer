import type { TreeItem } from "../types/tree";
import type { ReplacementResults } from "../../../src/types";

type MainAction = {
  type: "RESET";
};

type FileFiltersAction =
  | { type: "SET_FILES_TO_INCLUDE"; payload: string }
  | { type: "SET_FILES_TO_EXCLUDE"; payload: string }
  | { type: "SET_USE_CURRENT_EDITORS"; payload: boolean }
  | { type: "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES"; payload: boolean }
  | {
      type: "SET_TREE_PREVIEW";
      payload: ReplacementResults;
    }
  | {
      type: "SET_FILE_TREE";
      payload: {
        tree: TreeItem[];
        quantity: number;
      };
    }
  | {
      type: "SET_TREE_ITEM_VISIBILITY";
      payload: {
        open: boolean;
        path: number[];
      };
    }
  | {
      type: "SET_TREE_ITEM_VISIBILITY_RECURSIVELY";
      payload: {
        open: boolean;
        path: number[];
      };
    };

type StepActions =
  | {
      type: "SET_STEP_EXPANDED";
      payload: {
        index: number;
        expanded: boolean;
      };
    }
  | {
      type: "SET_STEP_FIND";
      payload: {
        index: number;
        find: {
          content: string;
        };
      };
    }
  | {
      type: "SET_STEP_REPLACE";
      payload: {
        index: number;
        replace: {
          content: string;
        };
      };
    };

type StepContextualAction =
  | {
      type: "SET_STEP_TITLE";
      payload: {
        id: string;
        title: string | undefined;
      };
    }
  | {
      type: "SET_STEP_POSITION";
      payload: {
        index: number;
        position: number;
      };
    }
  | {
      type: "ADD_STEP";
      payload: {
        index: number;
        position: number;
      };
    }
  | {
      type: "SET_STEP_ENABLED";
      payload: {
        index: number;
        enabled: boolean;
      };
    }
  | {
      type: "REMOVE_STEP";
      payload: {
        index: number;
      };
    };

type StepFindContextualAction =
  | {
      type: "SET_STEP_FIND_REGEXP";
      payload: {
        index: number;
        find: {
          regExp: boolean;
        };
      };
    }
  | {
      type: "SET_STEP_FIND_CASE_SENSITIVE";
      payload: {
        index: number;
        find: {
          caseSensitive: boolean;
        };
      };
    }
  | {
      type: "SET_STEP_FIND_WORD_WRAP";
      payload: {
        index: number;
        find: {
          wordWrap: boolean;
        };
      };
    };

type StepReplaceContextualAction = {
  type: "SET_STEP_REPLACE_WORD_WRAP";
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
