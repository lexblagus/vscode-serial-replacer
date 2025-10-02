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
  | 'debug' // usually for variables like 'var', var
  | 'log' // usually for method names, like func.name
  | 'info' // usually for verbose text like 'Validation successful'
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
