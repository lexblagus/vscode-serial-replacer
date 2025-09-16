import type { ReplacementResults } from "./replacements";

export const getStats = (results: ReplacementResults) =>
  Object.values(results).reduce(
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
