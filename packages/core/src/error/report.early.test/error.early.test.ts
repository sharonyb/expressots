// Unit tests for: error

import { AppError } from "../app-error";
import { Report } from "../report";

describe("Report.error() error method", () => {
  let report: Report;

  beforeEach(() => {
    report = new Report();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should create and return an AppError when given an Error object", () => {
      const error = new Error("Test error message");
      const statusCode = 400;
      const service = "TestService";

      const result = report.error(error, statusCode, service);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("Test error message");
      expect(result.statusCode).toBe(400);
      expect(result.service).toBe("TestService");
    });

    it("should create and return an AppError when given a string message", () => {
      const errorMessage = "Test error message";
      const statusCode = 500;
      const service = "TestService";

      const result = report.error(errorMessage, statusCode, service);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("Test error message");
      expect(result.statusCode).toBe(500);
      expect(result.service).toBe("TestService");
    });

    it("should default to status code 500 when not provided", () => {
      const errorMessage = "Test error message";

      const result = report.error(errorMessage);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("Test error message");
      expect(result.statusCode).toBe(500);
      expect(result.service).toBeUndefined();
    });

    it("should log the error message and service name", () => {
      const errorMessage = "Test error message";
      const service = "TestService";

      const consoleErrorSpy = jest
        .spyOn(process.stderr, "write")
        .mockImplementation();

      report.error(errorMessage, 500, service);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle an empty string as an error message", () => {
      const errorMessage = "";
      const result = report.error(errorMessage);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("");
      expect(result.statusCode).toBe(500);
      expect(result.service).toBeUndefined();
    });

    it("should handle undefined as an error message", () => {
      const result = report.error(undefined as any);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("undefined");
      expect(result.statusCode).toBe(500);
      expect(result.service).toBeUndefined();
    });

    it("should handle null as an error message", () => {
      const result = report.error(null as any);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("null");
      expect(result.statusCode).toBe(500);
      expect(result.service).toBeUndefined();
    });

    it("should handle a very long error message", () => {
      const longErrorMessage = "a".repeat(1000); // 1000 characters long
      const result = report.error(longErrorMessage);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe(longErrorMessage);
      expect(result.statusCode).toBe(500);
      expect(result.service).toBeUndefined();
    });

    it("should handle an error with no service name", () => {
      const error = new Error("Test error without service");

      const result = report.error(error);

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("Test error without service");
      expect(result.statusCode).toBe(500);
      expect(result.service).toBeUndefined();
    });
  });
});

// End of unit tests for: error
