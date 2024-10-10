// Unit tests for: messageServer

import { Console, IApplicationMessageToConsole } from "../console";

describe("Console.messageServer() messageServer method", () => {
  let consoleInstance: Console;
  const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

  beforeEach(() => {
    consoleInstance = new Console();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should log the message with default application name and version in development environment", async () => {
      // Arrange
      const port = 3000;
      const environment = "development";
      const expectedMessage =
        "Application version not provided is running on port 3000 - Environment: development";

      // Act
      await consoleInstance.messageServer(port, environment);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(expectedMessage),
      );
    });

    it("should log the message with provided application name and version in production environment", async () => {
      // Arrange
      const port = 8080;
      const environment = "production";
      const consoleMessage: IApplicationMessageToConsole = {
        appName: "MyApp",
        appVersion: "1.0.0",
      };
      const expectedMessage =
        "MyApp version 1.0.0 is running on port 8080 - Environment: production";

      // Act
      await consoleInstance.messageServer(port, environment, consoleMessage);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(expectedMessage),
      );
    });

    it("should log the message with default application name in staging environment", async () => {
      // Arrange
      const port = 4000;
      const environment = "staging";
      const expectedMessage =
        "Application version not provided is running on port 4000 - Environment: staging";

      // Act
      await consoleInstance.messageServer(port, environment);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(expectedMessage),
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should log the message with default application name and version for an unknown environment", async () => {
      // Arrange
      const port = 5000;
      const environment = "unknown";
      const expectedMessage =
        "Application version not provided is running on port 5000 - Environment: unknown";

      // Act
      await consoleInstance.messageServer(port, environment);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(expectedMessage),
      );
    });

    it("should handle empty application name and version gracefully", async () => {
      // Arrange
      const port = 6000;
      const environment = "production";
      const consoleMessage: IApplicationMessageToConsole = {
        appName: "",
        appVersion: "",
      };
      const expectedMessage =
        " version  is running on port 6000 - Environment: production";

      // Act
      await consoleInstance.messageServer(port, environment, consoleMessage);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(expectedMessage),
      );
    });

    it("should handle case sensitivity in environment input", async () => {
      // Arrange
      const port = 7000;
      const environment = "DEVELOPMENT"; // Uppercase
      const expectedMessage =
        "Application version not provided is running on port 7000 - Environment: DEVELOPMENT";

      // Act
      await consoleInstance.messageServer(port, environment);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(expectedMessage),
      );
    });
  });
});

// End of unit tests for: messageServer
