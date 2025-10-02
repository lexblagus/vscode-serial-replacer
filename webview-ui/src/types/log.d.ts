export type Tag =
  | 'app'
  | 'context'
  | 'reducer'
  | 'hook'
  | 'component'
  | 'effect'
  | 'function'
  | 'handler'
  | 'utils'
  ;

export type Level =
  | 'debug'
  | 'log'
  | 'info'
  | 'warn'
  | 'error';

export type ConsoleArguments = Parameters<(typeof console)[Level]>;

export interface AllowDenyEntry {
  tag?: Tag;
  title?: string;
  level?: Level;
}

export interface FilterConfig {
  allow: AllowDenyEntry[];
  deny: AllowDenyEntry[];
}
