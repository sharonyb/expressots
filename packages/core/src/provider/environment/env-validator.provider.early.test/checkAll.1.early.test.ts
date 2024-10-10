// Unit tests for: checkAll

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { EnvValidatorProvider } from "../env-validator.provider";

jest.mock("fs");
jest.mock("dotenv");

describe("EnvValidatorProvider.checkAll() checkAll method", () => {
  const envValidator = new EnvValidatorProvider();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {}; // Reset the environment variables before each test
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should load environment variables successfully when .env file exists and all variables are set", () => {
      // Arrange
      const mockEnvVars = {
        VAR1: "value1",
        VAR2: "value2",
      };
      const mockDotenvConfigOutput = { parsed: mockEnvVars };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (dotenv.config as jest.Mock).mockReturnValue(mockDotenvConfigOutput);
      process.env = { ...mockEnvVars };

      // Act
      envValidator.checkAll();

      // Assert
      expect(fs.existsSync).toHaveBeenCalledWith(
        path.join(process.cwd(), ".", ".env"),
      );
      expect(dotenv.config).toHaveBeenCalledWith({
        path: path.join(process.cwd(), ".", ".env"),
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should exit the process if the .env file does not exist", () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

      // Act
      envValidator.checkAll();

      // Assert
      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });

    it("should exit the process if the .env file exists but some variables are not set", () => {
      // Arrange
      const mockEnvVars = {
        VAR1: "value1",
        VAR2: "value2",
      };
      const mockDotenvConfigOutput = { parsed: mockEnvVars };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (dotenv.config as jest.Mock).mockReturnValue(mockDotenvConfigOutput);
      process.env = { VAR1: "value1" }; // VAR2 is missing

      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

      // Act
      envValidator.checkAll();

      // Assert
      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });

    it("should exit the process if the .env file exists but some variables are empty", () => {
      // Arrange
      const mockEnvVars = {
        VAR1: "value1",
        VAR2: "",
      };
      const mockDotenvConfigOutput = { parsed: mockEnvVars };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (dotenv.config as jest.Mock).mockReturnValue(mockDotenvConfigOutput);
      process.env = { VAR1: "value1", VAR2: "" }; // VAR2 is empty

      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

      // Act
      envValidator.checkAll();

      // Assert
      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });

    it("should not exit the process if the .env file exists and all variables are set", () => {
      // Arrange
      const mockEnvVars = {
        VAR1: "value1",
        VAR2: "value2",
      };
      const mockDotenvConfigOutput = { parsed: mockEnvVars };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (dotenv.config as jest.Mock).mockReturnValue(mockDotenvConfigOutput);
      process.env = { ...mockEnvVars };

      const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

      // Act
      envValidator.checkAll();

      // Assert
      expect(exitSpy).not.toHaveBeenCalled();
      exitSpy.mockRestore();
    });
  });
});

// End of unit tests for: checkAll
