// Unit tests for: warn

import { Logger } from "../logger.provider";

describe("Logger.warn() warn method", () => {
  let logger: Logger;
  const originalWrite = process.stdout.write;

  beforeEach(() => {
    logger = new Logger();
    // Mock process.stdout.write to capture output
    process.stdout.write = jest.fn();
  });

  afterEach(() => {
    // Restore original process.stdout.write
    process.stdout.write = originalWrite;
  });

  describe("Happy Path", () => {
    it("should log a warning message without a module", () => {
      const message = "This is a warning message";
      logger.warn(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("WARN"),
      );
    });

    it("should log a warning message with a module", () => {
      const message = "This is a warning message";
      const module = "testModule";
      logger.warn(message, module);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(module),
      );
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("WARN"),
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle an empty warning message", () => {
      const message = "";
      logger.warn(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("WARN"),
      );
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(""),
      );
    });

    it("should handle a warning message with special characters", () => {
      const message = "Warning: Special characters !@#$%^&*()";
      logger.warn(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("WARN"),
      );
    });

    it("should handle a warning message with a long string", () => {
      const message =
        "This is a very long warning message that exceeds typical lengths to test how the logger handles it. ".repeat(
          5,
        );
      logger.warn(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("WARN"),
      );
    });

    it("should handle a module name that is an empty string", () => {
      const message = "This is a warning message";
      const module = "";
      logger.warn(message, module);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("WARN"),
      );
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(""),
      );
    });
  });
});

// End of unit tests for: warn
