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
import config from "../../config.json";


import { FilterConfig, Level, Tag } from "./types";

export const enabled = config.log.enabled;

export const filterConfig: FilterConfig = config.log.filters as FilterConfig;
/*
  examples:
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
