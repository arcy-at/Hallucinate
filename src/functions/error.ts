import { Markup } from "detritus-client/lib/utils";

export enum ErrorLevels {
  ERROR = "error",
  WARNING = "warn",
  INFO = "info",
  DEBUG = "debug",
}
export const ErrorEmojis: Record<ErrorLevels, string> = {
  [ErrorLevels.ERROR]: "❌",
  [ErrorLevels.WARNING]: "⚠️",
  [ErrorLevels.INFO]: "🔍",
  [ErrorLevels.DEBUG]: "🐛",
};
export interface ErrorOptions<T> {
  level?: ErrorLevels;
  status?: number;
  statusText?: string;
  metadata?: T;
}
export class Err<T = string, M = any> {
  public options: ErrorOptions<M>;
  public level: ErrorLevels;
  public status: number;
  public metadata: M | undefined;

  public message: T;
  constructor(message: T, options: ErrorOptions<M> = {}) {
    this.message = message;

    this.options = options;
    this.level = this.options.level || ErrorLevels.ERROR;
    this.status = this.options.status || 500;
    this.metadata = this.options.metadata;
  }

  public toString(): string {
    return `Error (${this.status}): ${this.message}`;
  }
  public toThrown(): string {
    return `${ErrorEmojis[this.level]} ${Markup.codestring(this.toString())}`;
  }

  static from(payload: Error | Err) {
    if (payload instanceof Err) {
      return payload;
    }
    return new Err(payload.message);
  }
}
