import type { FilterConfig } from "./log";
import type { Options as MicromatchOptions } from "micromatch";

// used in runtime so this file cannot be a .d.ts
export enum LogLevel {
  silent = 0,
  fatal = 1,
  error = 2,
  warn = 3,
  info = 4,
  debug = 5,
  trace = 6,
}

export type LogLevels = keyof typeof LogLevel;

export interface Config {
  logOutputPanel: {
    LogLevel: LogLevels;
    maximumMessageLength: number;
  };
  fileFilters: {
    micromatchOptions: MicromatchOptions;
  };
  fields: { historyLimit: number; keystrokeDebounceDelay: number };
  fileTree: { expandRecursivellyMaximumSize: number };
  devTools: {
    logEnabled: boolean;
    logFilter: FilterConfig;
  };
}
