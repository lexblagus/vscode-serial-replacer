import { Uri, Webview } from "vscode";
import { existsSync } from "fs";
import { basename, dirname, extname, join } from "path";
import { isMatch } from "micromatch";
import prefs from "./config.json";

/**
 * A helper function that returns a unique alphanumeric identifier called a nonce.
 *
 * @remarks This function is primarily used to help enforce content security
 * policies for resources/scripts being executed in a webview context.
 *
 * @returns A nonce
 */
export function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * A helper function which will get the webview URI of a given file or resource.
 *
 * @remarks This URI can be used within a webview's HTML as a link to the
 * given file/resource.
 *
 * @param webview A reference to the extension webview
 * @param extensionUri The URI of the directory containing the extension
 * @param pathList An array of strings representing the path to a file/resource
 * @returns A URI pointing to the file/resource
 */
export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

export function safeStringify(obj: any) {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    },
    2
  );
}

export function filterFileByLists(
  filePath: string,
  includeFilesList: string[],
  excludeFilesList: string[]
): string | undefined {
  if (!existsSync(filePath)) {
    return;
  }

  if (includeFilesList.length > 0) {
    if (!isMatch(filePath, includeFilesList, prefs.micromatchOptions)) {
      return;
    }
  }

  if (excludeFilesList.length > 0) {
    if (isMatch(filePath, excludeFilesList, prefs.micromatchOptions)) {
      return;
    }
  }

  return filePath;
}

export function splitOutsideCurlyBraces(input: string): string[] {
  const result: string[] = [];
  let current = "";
  let depth = 0; // Track curly brace nesting
  let skipSpace = false;

  for (const char of input) {
    if (char === "{") {
      depth++;
      current += char;
    } else if (char === "}") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      result.push(current.trim());
      current = "";
      skipSpace = true; // Skip spaces immediately after comma
    } else if (skipSpace && char === " ") {
      continue; // Ignore spaces after comma
    } else {
      skipSpace = false;
      current += char;
    }
  }

  if (current) {
    result.push(current.trim());
  }

  return result;
}

export const makePreviewUri = (filePath: string): Uri => {
  const base = basename(filePath, extname(filePath)); // e.g. forty-eight
  const ext = extname(filePath); // e.g. .log
  const preExt = ""; // '.replaced';
  const previewName = `${base}${preExt}${ext}`; // forty-eight.preview.log
  return Uri.parse(`untitled:${join(dirname(filePath), previewName)}`);
};
