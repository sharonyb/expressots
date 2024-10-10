// Unit tests for: formatMessage

import { colorCodes } from "../../../common/color-codes";
import { Logger, LogLevel } from "../logger.provider";

describe("Logger.formatMessage() formatMessage method", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should format an INFO message correctly", () => {
      const message = "This is an info message";
      const expectedOutput = expect.stringContaining("[ExpressoTS]");
      const formattedMessage = logger["formatMessage"]("INFO", message);

      expect(formattedMessage).toEqual(expectedOutput);
      expect(formattedMessage).toContain(colorCodes["blue"]);
      expect(formattedMessage).toContain(message);
    });

    it("should format a WARN message correctly", () => {
      const message = "This is a warning message";
      const expectedOutput = expect.stringContaining("[ExpressoTS]");
      const formattedMessage = logger["formatMessage"]("WARN", message);

      expect(formattedMessage).toEqual(expectedOutput);
      expect(formattedMessage).toContain(colorCodes["yellow"]);
      expect(formattedMessage).toContain(message);
    });

    it("should format an ERROR message correctly", () => {
      const message = "This is an error message";
      const expectedOutput = expect.stringContaining("[ExpressoTS]");
      const formattedMessage = logger["formatMessage"]("ERROR", message);

      expect(formattedMessage).toEqual(expectedOutput);
      expect(formattedMessage).toContain(colorCodes["red"]);
      expect(formattedMessage).toContain(message);
    });

    it("should format a message with a module name", () => {
      const message = "This is a message with a module";
      const module = "TestModule";
      const formattedMessage = logger["formatMessage"]("INFO", message, module);

      expect(formattedMessage).toContain(`[${module}]`);
      expect(formattedMessage).toContain(message);
    });

    it("should format a message with no log level (NONE)", () => {
      const message = "This is a message with no log level";
      const formattedMessage = logger["formatMessage"]("NONE", message);

      expect(formattedMessage).toContain(colorCodes["none"]);
      expect(formattedMessage).toContain(message);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle an empty message", () => {
      const message = "";
      const formattedMessage = logger["formatMessage"]("INFO", message);

      expect(formattedMessage).toContain(message);
    });

    it("should handle a long message", () => {
      const message = "A".repeat(1000); // Very long message
      const formattedMessage = logger["formatMessage"]("INFO", message);

      expect(formattedMessage).toContain(message);
    });

    it("should handle a null module name", () => {
      const message = "Message with null module";
      const formattedMessage = logger["formatMessage"]("INFO", message, null);

      expect(formattedMessage).toContain("[null]");
      expect(formattedMessage).toContain(message);
    });

    it("should handle an undefined module name", () => {
      const message = "Message with undefined module";
      const formattedMessage = logger["formatMessage"](
        "INFO",
        message,
        undefined,
      );

      expect(formattedMessage).toContain("[]");
      expect(formattedMessage).toContain(message);
    });

    it("should handle an invalid log level", () => {
      const message = "Message with invalid log level";
      const formattedMessage = logger["formatMessage"](
        "INVALID" as LogLevel,
        message,
      );

      expect(formattedMessage).toContain(colorCodes["none"]);
      expect(formattedMessage).toContain(message);
    });
  });
});

// End of unit tests for: formatMessage
