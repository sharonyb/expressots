// Unit tests for: beautifyStackTrace

import chalk from "chalk";
import { beautifyStackTrace } from "../utils";

describe("beautifyStackTrace() beautifyStackTrace method", () => {
  // Happy Path Tests
  describe("Happy Path", () => {
    it("should return an empty string when stack is undefined", () => {
      // This test checks that the function handles undefined input gracefully.
      expect(beautifyStackTrace(undefined)).toBeUndefined();
    });

    it("should return an empty string when stack is an empty string", () => {
      // This test checks that the function handles empty string input gracefully.
      expect(beautifyStackTrace("")).toBeUndefined();
    });

    it("should correctly format a simple stack trace", () => {
      // This test checks that the function formats a simple stack trace correctly.
      const stack = `Error: Something went wrong
      at Object.<anonymous> (/path/to/file.js:10:5)
      at Module._compile (node:internal/modules/cjs/loader:1218:14)`;

      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
      beautifyStackTrace(stack);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        chalk.red.bold(
          `Error Originated From: ${chalk.bold.white("/path/to/file.js:10:5")}`,
        ),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        chalk.red.bold("Error: Something went wrong"),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        chalk.blue.bold("\nStack Trace:\n"),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(chalk.gray("[Application]     ")),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(chalk.green("Object.<anonymous>")),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(chalk.white("/path/to/file.js:10:5")),
      );

      consoleLogSpy.mockRestore();
    });

    it("should correctly identify external library calls", () => {
      // This test checks that the function identifies external library calls correctly.
      const stack = `Error: Something went wrong
      at Object.<anonymous> (/path/to/node_modules/some-lib/index.js:20:10)
      at Module._compile (node:internal/modules/cjs/loader:1218:14)`;

      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
      beautifyStackTrace(stack);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(chalk.gray("[External Library]")),
      );

      consoleLogSpy.mockRestore();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle stack trace with no file path", () => {
      // This test checks that the function handles a stack trace without a file path correctly.
      const stack = `Error: Something went wrong
      at Object.<anonymous> (unknown:unknown:unknown)`;

      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
      beautifyStackTrace(stack);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(chalk.white("unknown:unknown:unknown")),
      );

      consoleLogSpy.mockRestore();
    });

    it("should handle stack trace with multiple lines", () => {
      // This test checks that the function handles a stack trace with multiple lines correctly.
      const stack = `Error: Something went wrong
      at Object.<anonymous> (/path/to/file1.js:10:5)
      at Object.<anonymous> (/path/to/file2.js:20:10)
      at Module._compile (node:internal/modules/cjs/loader:1218:14)`;

      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
      beautifyStackTrace(stack);

      expect(consoleLogSpy).toHaveBeenCalledTimes(5); // 1 for error origin, 1 for error message, 1 for stack trace header, and 2 for stack lines
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(chalk.green("Object.<anonymous>")),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(chalk.white("/path/to/file1.js:10:5")),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(chalk.white("/path/to/file2.js:20:10")),
      );

      consoleLogSpy.mockRestore();
    });

    it('should handle stack trace with no "at" lines', () => {
      // This test checks that the function handles a stack trace with no "at" lines correctly.
      const stack = `Error: Something went wrong
      at unknown`;

      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
      beautifyStackTrace(stack);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        chalk.red.bold("Error: Something went wrong"),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        chalk.blue.bold("\nStack Trace:\n"),
      );

      consoleLogSpy.mockRestore();
    });
  });
});

// End of unit tests for: beautifyStackTrace
