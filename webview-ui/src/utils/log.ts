import {
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright,
  dim,
  bold,
  hidden,
  italic,
  underline,
  strikethrough,
  reset,
  bgGray,
} from "ansis";
import config from "../config.json";

import type { ConsoleArguments, FilterConfig, Level, Tag } from "../types/log";

const enabled = config.log.enabled;

/*
  filter config examples:
  {
    allow: [
      // {level: 'info'},
      // {tag: 'e2e/app'},
      // {title: 'flatCommands'},
    ],
    deny: [
      // {level: 'info', tag: 'hook', title: 'useApp'},
      // {title: 'useAppContext'},
      // {level: 'log', tag: 'hook', title: 'useBackendMessages'},
      // {level: 'log', tag: 'hook', title: 'useStateRefSync'},
    ],
  }
*/
export const filterConfig: FilterConfig = config.log.filters as FilterConfig;

let tagMaxLen = 0,
  titleMaxLen = 0,
  levelMaxLen = 0;

export const formatLevel: Record<Level, (x: string) => string> = {
  debug: (s) => bgGray.black(s),
  log: (s) => bgGreen.black(s),
  info: (s) => bgBlue.black(s),
  warn: (s) => bgYellow.black(s),
  error: (s) => bgRed.black(s),
};

export const formatConfig: Record<Tag, (x: string) => string> = {
  app: (s) => bgRed.black(s),
  context: (s) => bgMagenta.black(s),
  reducer: (s) => bgRedBright.black(s),
  hook: (s) => bgMagentaBright.black(s),
  component: (s) => bgYellow.black(s),
  effect: (s) => bgGreen.black(s),
  function: (s) => bgBlue.black(s),
  handler: (s) => bgCyan.black(s),
  utils: (s) => bgGray.black(s),
};

/*
Common usage:

// Usually for verbose text
log('tag', 'MethodName', 'info', 'Validation successful');

// Usually in begin of methods and functions
log('tag', 'MethodName', 'log', `…called; parameters={JSON.stringify({argument1, argument2})}`);

Free text indication a condition is met or, a proccess continuity etc., usually in the middle of the logic
log('tag', 'MethodName', 'debug', `parameters={JSON.stringify({requestParameters, responseData})}`);
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

    const spacer = " ";
    const separator = " ";

    const tokenLevel = formatLevel[level](
      spacer + partLevel.toUpperCase() + partLevelSpacer + spacer
    );
    const tokenTag = formatConfig[tag](spacer + partTag + partTagSpacer + spacer);
    const tokentitle = formatConfig[tag](spacer + partTitle + partTitleSpacer + spacer);

    const header = `${tokenLevel}${separator}${tokenTag}${separator}${tokentitle}`;

    console[level](header, ...args);
  }
};
