// Unit tests for: checkAll

import dotenv from "dotenv";
import fs from "fs";
import { EnvValidatorProvider } from "../env-validator.provider";

jest.mock("fs");
jest.mock("dotenv");

describe("EnvValidatorProvider.checkAll() checkAll method", () => {
  const originalExit = process.exit;
  const mockExit = jest.fn();
  const envValidatorProvider = new EnvValidatorProvider();

  beforeAll(() => {
    process.exit = mockExit; // Mock process.exit to prevent the actual exit during tests
  });

  afterAll(() => {
    process.exit = originalExit; // Restore original process.exit
  });

  describe("Happy Path", () => {
    beforeEach(() => {
      // Mocking the existence of the .env file
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (dotenv.config as jest.Mock).mockReturnValue({
        parsed: {
          VAR1: "value1",
          VAR2: "value2",
        },
      });
      process.env.VAR1 = "value1";
      process.env.VAR2 = "value2";
    });

    it("should load environment variables successfully when .env file exists and all variables are set", () => {
      expect(() => envValidatorProvider.checkAll()).not.toThrow();
      expect(mockExit).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
    });

    it("should log an error and exit if the .env file does not exist", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      expect(() => envValidatorProvider.checkAll()).toThrow();
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should log an error and exit if an environment variable is not defined", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (dotenv.config as jest.Mock).mockReturnValue({
        parsed: {
          VAR1: "value1",
          VAR2: "value2",
        },
      });
      delete process.env.VAR1; // Simulate VAR1 not being set

      expect(() => envValidatorProvider.checkAll()).toThrow();
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should log an error and exit if an environment variable is an empty string", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (dotenv.config as jest.Mock).mockReturnValue({
        parsed: {
          VAR1: "value1",
          VAR2: "value2",
        },
      });
      process.env.VAR1 = ""; // Simulate VAR1 being an empty string
      process.env.VAR2 = "value2";

      expect(() => envValidatorProvider.checkAll()).toThrow();
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should not exit if all environment variables are set correctly", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (dotenv.config as jest.Mock).mockReturnValue({
        parsed: {
          VAR1: "value1",
          VAR2: "value2",
        },
      });
      process.env.VAR1 = "value1";
      process.env.VAR2 = "value2";

      expect(() => envValidatorProvider.checkAll()).not.toThrow();
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: checkAll
