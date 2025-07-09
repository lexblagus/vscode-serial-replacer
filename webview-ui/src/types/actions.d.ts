import type { TreeItem } from "../types/tree";

type MainAction = {
  type: "RESET";
};

type FileFiltersAction =
  | { type: "SET_FILES_TO_INCLUDE"; payload: string }
  | { type: "SET_FILES_TO_EXCLUDE"; payload: string }
  | { type: "SET_USE_CURRENT_EDITORS"; payload: boolean }
  | { type: "SET_EXCLUDE_SETTINGS_AND_IGNORE_FILES"; payload: boolean }
  | { type: "SET_FILE_TREE"; payload: TreeItem[] };

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
        index: number;
        title: string;
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
      type: "SET_STEP_FIND_GLOBAL";
      payload: {
        index: number;
        find: {
          global: boolean;
        };
      };
    }
  | {
      type: "SET_STEP_FIND_MULTILINE";
      payload: {
        index: number;
        find: {
          multiline: boolean;
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
