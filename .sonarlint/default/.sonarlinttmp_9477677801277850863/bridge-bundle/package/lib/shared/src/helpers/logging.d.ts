/**
 * Prints a message to `stdout` like `console.log` by prefixing it with `DEBUG`.
 *
 * The `DEBUG` prefix is recognized by the scanner, which
 * will show the logged message in the scanner debug logs.
 *
 * @param message the message to log
 */
export declare function debug(message: string): void;
export declare function error(message: string): void;
export declare function info(message: string): void;
export declare function warn(message: string): void;
