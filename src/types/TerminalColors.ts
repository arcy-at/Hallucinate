export namespace TerminalColor {
  export const enum normal {
    BLACK = "\u001b[30m",
    RED = "\u001b[31m",
    GREEN = "\u001b[32m",
    YELLOW = "\u001b[33m",
    BLUE = "\u001b[34m",
    MAGENTA = "\u001b[35m",
    CYAN = "\u001b[36m",
    WHITE = "\u001b[37m",
  }

  export const enum bright {
    BRIGHT_BLACK = "\u001b[30;1m",
    BRIGHT_RED = "\u001b[31;1m",
    BRIGHT_GREEN = "\u001b[32;1m",
    BRIGHT_YELLOW = "\u001b[33;1m",
    BRIGHT_BLUE = "\u001b[34;1m",
    BRIGHT_MAGENTA = "\u001b[35;1m",
    BRIGHT_CYAN = "\u001b[36;1m",
    BRIGHT_WHITE = "\u001b[37;1m",
  }

  export const enum format {
    BOLD = "\u001b[1m",
    UNDERLINE = "\u001b[4m",
    REVERSED = "\u001b[7m",
  }

  export const reset = "\u001b[0m";
}
export function color(
  s: any,
  color: TerminalColor.bright | TerminalColor.format | TerminalColor.normal
) {
  return color + s + TerminalColor.reset;
}
