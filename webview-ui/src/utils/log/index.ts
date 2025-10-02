import { enabled, filterConfig, formatConfig, formatLevel } from "./config";
import { ConsoleArguments, Level, Tag } from "./types";

// =============================================================================

let tagMaxLen = 0,
  titleMaxLen = 0,
  levelMaxLen = 0;

/*
Common usage:

import {log} from 'src/utils/log';

// function names (first line of a title):
log('tag', func.name, 'info');

// log variables
log('tag', func.name, 'log', 'var', var);

// free text indication a condition is met or, a proccess continuity etc.
log('tag', func.name, 'debug', 'text');
*/

export const log = (tag: Tag, title: string, level: Level, ...args: ConsoleArguments) => {
  if (!enabled) {
    return;
  }

  const isAllowed =
    filterConfig.allow.length === 0 ||
    filterConfig.allow.some(
      (entry) =>
        (!entry.tag || entry.tag === tag) &&
        (!entry.title || entry.title === title) &&
        (!entry.level || entry.level === level)
    );

  const isDenied = filterConfig.deny.some(
    (entry) =>
      (!entry.tag || entry.tag === tag) &&
      (!entry.title || entry.title === title) &&
      (!entry.level || entry.level === level)
  );

  if (isAllowed && !isDenied) {
    if (level.length > levelMaxLen) {
      levelMaxLen = level.length;
    }
    if (tag.length > tagMaxLen) {
      tagMaxLen = tag.length;
    }
    if (title.length > titleMaxLen) {
      titleMaxLen = title.length;
    }

    const partLevel = level;
    const partLevelSpacer = " ".repeat(levelMaxLen - level.length);
    const partTag = tag;
    const partTagSpacer = " ".repeat(tagMaxLen - tag.length);
    const partTitle = title;
    const partTitleSpacer = " ".repeat(titleMaxLen - title.length);

    const spacer = ' ';
    const separator = ' ';

    const tokenLevel =
      formatLevel[level](
        spacer + partLevel.toUpperCase() + partLevelSpacer + spacer
      );
    const tokenTag =
      formatConfig[tag](spacer + partTag + partTagSpacer + spacer);
    const tokentitle = formatConfig[tag](
       spacer + partTitle + partTitleSpacer + spacer
    );

    const header = `${tokenLevel}${separator}${tokenTag}${separator}${tokentitle}`;

    console[level](header, ...args);
  }
};
