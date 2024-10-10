// Unit tests for: defaultErrorHandler

import { NextFunction, Response } from "express";
import { AppError } from "../app-error";
import defaultErrorHandler from "../error-handler-middleware";
import { StatusCode } from "../status-code";
import { beautifyStackTrace } from "../utils";

jest.mock("../utils", () => {
  const actual = jest.requireActual("../utils"); // This fetches the actual implementations

  return {
    ...actual, // Uses the actual implementations
    beautifyStackTrace: jest.fn(), // Mocking beautifyStackTrace
  };
});

describe("defaultErrorHandler() defaultErrorHandler method", () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    next = jest.fn();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should handle AppError correctly", () => {
      // This test checks if the handler correctly processes an AppError.
      const error = new AppError("Not Found", StatusCode.NotFound);
      defaultErrorHandler(error, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.NotFound);
      expect(res.json).toHaveBeenCalledWith({
        code: StatusCode.NotFound,
        error: "Not Found",
      });
    });

    it("should handle unexpected errors correctly", () => {
      // This test checks if the handler processes a generic error correctly.
      const error = new Error("Some unexpected error");
      defaultErrorHandler(error, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCode.InternalServerError);
      expect(res.json).toHaveBeenCalledWith({
        code: StatusCode.InternalServerError,
        error: "An unexpected error occurred.",
      });
    });

    it("should call beautifyStackTrace when showStackTrace is true", () => {
      // This test checks if beautifyStackTrace is called when showStackTrace is true.
      const error = new Error("Some error with stack");
      error.stack = "Error stack trace";
      defaultErrorHandler(error, res, next, true);

      expect(beautifyStackTrace).toHaveBeenCalledWith(error.stack);
    });

    it("should not call beautifyStackTrace when showStackTrace is false", () => {
      // This test checks if beautifyStackTrace is not called when showStackTrace is false.
      const error = new Error("Some error without stack");
      defaultErrorHandler(error, res, next, false);

      expect(beautifyStackTrace).not.toHaveBeenCalled();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle error without stack gracefully", () => {
      // This test checks if the handler can process an error without a stack.
      const error = new Error("Error without stack");
      delete error.stack; // Simulating an error without a stack
      defaultErrorHandler(error, res, next, true);

      expect(res.status).toHaveBeenCalledWith(StatusCode.InternalServerError);
      expect(res.json).toHaveBeenCalledWith({
        code: StatusCode.InternalServerError,
        error: "An unexpected error occurred.",
      });
      expect(beautifyStackTrace).not.toHaveBeenCalled();
    });

    // it("should call next with error if an error occurs in the handler", () => {
    //   // This test checks if the next function is called when an error occurs in the handler.
    //   const error = new Error("Some error");
    //   const faultyHandler = () => {
    //     throw new Error("Handler error");
    //   };

    //   // Override the defaultErrorHandler to simulate an error
    //   const originalHandler = defaultErrorHandler;
    //   (defaultErrorHandler as any) = faultyHandler;

    //   defaultErrorHandler(error, res, next);

    //   expect(next).toHaveBeenCalledWith(expect.any(Error));

    //   // Restore the original handler
    //   defaultErrorHandler = originalHandler;
    // });
  });
});

// End of unit tests for: defaultErrorHandler
