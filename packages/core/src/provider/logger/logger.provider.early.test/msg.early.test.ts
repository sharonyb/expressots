// Unit tests for: msg

import { Logger } from "../logger.provider";

describe("Logger.msg() msg method", () => {
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
    it("should log a message without a module", () => {
      const message = "This is a test message";
      logger.msg(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should log a message with a module", () => {
      const message = "This is a test message";
      const module = "TestModule";
      logger.msg(message, module);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(module),
      );
    });

    it("should log a message with an empty module", () => {
      const message = "This is a test message";
      logger.msg(message, "");
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("[ ]"),
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle an empty message", () => {
      const message = "";
      logger.msg(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should handle a null message", () => {
      const message = null as unknown as string; // Type assertion to simulate null
      logger.msg(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining("null"),
      );
    });

    it("should handle a message with special characters", () => {
      const message = "Message with special characters: !@#$%^&*()";
      logger.msg(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should handle a long message", () => {
      const message = "A".repeat(1000); // Long message
      logger.msg(message);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });
  });
});

// End of unit tests for: msg
