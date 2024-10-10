// Unit tests for: setErrorHandler

import { NextFunction, Response } from "express";
import defaultErrorHandler from "../../error/error-handler-middleware";
import { ErrorHandlerOptions, Middleware } from "../middleware-service";

// Mocking the middlewareResolver and defaultErrorHandler
jest.mock("../middleware-resolver", () => {
  const actual = jest.requireActual("../middleware-resolver");
  return {
    ...actual,
    middlewareResolver: jest.fn(),
  };
});

jest.mock("../../error/error-handler-middleware", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

// Mocking express types
const mockResponse = {} as Response;
const mockNext = jest.fn() as NextFunction;

describe("Middleware.setErrorHandler() setErrorHandler method", () => {
  let middleware: Middleware;

  beforeEach(() => {
    middleware = new Middleware();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should set a custom error handler when provided", () => {
      const customErrorHandler = jest.fn();
      const options: ErrorHandlerOptions = { errorHandler: customErrorHandler };

      middleware.setErrorHandler(options);

      const errorHandler = middleware.getErrorHandler();
      expect(errorHandler).toBe(customErrorHandler);
    });

    it("should set the default error handler when no custom handler is provided", () => {
      middleware.setErrorHandler();

      const errorHandler = middleware.getErrorHandler();
      expect(errorHandler).toBeInstanceOf(Function);
      expect(defaultErrorHandler).toHaveBeenCalledWith(
        expect.any(Error),
        mockResponse,
        mockNext,
        false,
      );
    });

    it("should set the default error handler with stack trace when showStackTrace is true", () => {
      middleware.setErrorHandler({ showStackTrace: true });

      const errorHandler = middleware.getErrorHandler();
      expect(errorHandler).toBeInstanceOf(Function);
      expect(defaultErrorHandler).toHaveBeenCalledWith(
        expect.any(Error),
        mockResponse,
        mockNext,
        true,
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle undefined error handler gracefully", () => {
      middleware.setErrorHandler({ errorHandler: undefined });

      const errorHandler = middleware.getErrorHandler();
      expect(errorHandler).toBeInstanceOf(Function);
      expect(defaultErrorHandler).toHaveBeenCalledWith(
        expect.any(Error),
        mockResponse,
        mockNext,
        false,
      );
    });

    it("should not throw an error when setErrorHandler is called multiple times", () => {
      expect(() => {
        middleware.setErrorHandler();
        middleware.setErrorHandler();
      }).not.toThrow();
    });

    it("should allow setting the error handler with showStackTrace as false", () => {
      middleware.setErrorHandler({ showStackTrace: false });

      const errorHandler = middleware.getErrorHandler();
      expect(errorHandler).toBeInstanceOf(Function);
      expect(defaultErrorHandler).toHaveBeenCalledWith(
        expect.any(Error),
        mockResponse,
        mockNext,
        false,
      );
    });
  });
});

// End of unit tests for: setErrorHandler
