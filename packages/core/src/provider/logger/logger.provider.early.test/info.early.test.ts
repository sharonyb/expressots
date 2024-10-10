// Unit tests for: info

import { Logger } from "../logger.provider";

describe("Logger.info() info method", () => {
  let logger: Logger;
  const originalStdoutWrite = process.stdout.write;

  beforeEach(() => {
    logger = new Logger();
    // Mock process.stdout.write to capture output
    process.stdout.write = jest.fn();
  });

  afterEach(() => {
    // Restore original stdout.write
    process.stdout.write = originalStdoutWrite;
  });

  describe("Happy Path", () => {
    it("should log an info message without a module", () => {
      const message = "This is an info message";
      logger.info(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("INFO"),
      );
    });

    it("should log an info message with a module", () => {
      const message = "This is an info message";
      const module = "TestModule";
      logger.info(message, module);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(module),
      );
    });

    it("should log an info message with a long message", () => {
      const message =
        "This is a very long info message that exceeds normal length";
      logger.info(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle an empty message", () => {
      const message = "";
      logger.info(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should handle a null message", () => {
      const message = null as unknown as string; // Type assertion to bypass TypeScript checks
      logger.info(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("null"),
      );
    });

    it("should handle undefined message", () => {
      const message = undefined as unknown as string; // Type assertion to bypass TypeScript checks
      logger.info(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("undefined"),
      );
    });

    it("should handle a message with special characters", () => {
      const message = "Info message with special characters: !@#$%^&*()";
      logger.info(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should handle a module name with special characters", () => {
      const message = "This is an info message";
      const module = "Module!@#$%^&*()";
      logger.info(message, module);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(module),
      );
    });
  });
});

// End of unit tests for: info
