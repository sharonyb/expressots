// Unit tests for: error

import { Logger } from "../logger.provider";

describe("Logger.error() error method", () => {
  let logger: Logger;
  const originalStderrWrite = process.stderr.write;

  beforeEach(() => {
    // Create a new instance of Logger before each test
    logger = new Logger();
    // Mock process.stderr.write to capture output
    process.stderr.write = jest.fn();
  });

  afterEach(() => {
    // Restore the original process.stderr.write after each test
    process.stderr.write = originalStderrWrite;
  });

  describe("Happy Path", () => {
    it("should log an error message without a module", () => {
      const message = "An error occurred";
      logger.error(message);
      expect(process.stderr.write).toHaveBeenCalledTimes(1);
      const output = (process.stderr.write as jest.Mock).mock.calls[0][0];
      expect(output).toContain("[ExpressoTS]");
      expect(output).toContain("ERROR");
      expect(output).toContain(message);
    });

    it("should log an error message with a module", () => {
      const message = "An error occurred";
      const module = "TestModule";
      logger.error(message, module);
      expect(process.stderr.write).toHaveBeenCalledTimes(1);
      const output = (process.stderr.write as jest.Mock).mock.calls[0][0];
      expect(output).toContain("[ExpressoTS]");
      expect(output).toContain("ERROR");
      expect(output).toContain(module);
      expect(output).toContain(message);
    });
  });

  describe("Edge Cases", () => {
    it("should handle an empty error message", () => {
      const message = "";
      logger.error(message);
      expect(process.stderr.write).toHaveBeenCalledTimes(1);
      const output = (process.stderr.write as jest.Mock).mock.calls[0][0];
      expect(output).toContain("[ExpressoTS]");
      expect(output).toContain("ERROR");
      expect(output).toContain(message);
    });

    it("should handle a long error message", () => {
      const message = "A".repeat(1000); // Very long message
      logger.error(message);
      expect(process.stderr.write).toHaveBeenCalledTimes(1);
      const output = (process.stderr.write as jest.Mock).mock.calls[0][0];
      expect(output).toContain("[ExpressoTS]");
      expect(output).toContain("ERROR");
      expect(output).toContain(message);
    });

    it("should handle a null error message", () => {
      const message = null;
      logger.error(message as any); // Cast to any to bypass TypeScript error
      expect(process.stderr.write).toHaveBeenCalledTimes(1);
      const output = (process.stderr.write as jest.Mock).mock.calls[0][0];
      expect(output).toContain("[ExpressoTS]");
      expect(output).toContain("ERROR");
      expect(output).toContain("null"); // Expecting 'null' string representation
    });

    it("should handle undefined error message", () => {
      const message = undefined;
      logger.error(message as any); // Cast to any to bypass TypeScript error
      expect(process.stderr.write).toHaveBeenCalledTimes(1);
      const output = (process.stderr.write as jest.Mock).mock.calls[0][0];
      expect(output).toContain("[ExpressoTS]");
      expect(output).toContain("ERROR");
      expect(output).toContain("undefined"); // Expecting 'undefined' string representation
    });
  });
});

// End of unit tests for: error
