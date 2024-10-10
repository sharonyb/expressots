// Unit tests for: addRateLimiter

import { middlewareResolver } from "../middleware-resolver";
import { Middleware } from "../middleware-service";

// Mocking middlewareResolver function
jest.mock("../middleware-resolver", () => {
  const actual = jest.requireActual("../middleware-resolver");
  return {
    ...actual,
    middlewareResolver: jest.fn(),
  };
});

// Mocking defaultErrorHandler function
jest.mock("../../error/error-handler-middleware", () => {
  const actual = jest.requireActual("../../error/error-handler-middleware");
  return {
    ...actual,
    defaultErrorHandler: jest.fn(),
  };
});

// Mock interfaces
interface MockRateLimitOptions {
  windowMs?: number;
  max?: number;
}

describe("Middleware.addRateLimiter() addRateLimiter method", () => {
  let middleware: Middleware;

  beforeEach(() => {
    middleware = new Middleware();
  });

  describe("Happy Path", () => {
    it("should add rate limiter middleware when it does not exist", () => {
      // Arrange
      const mockOptions: MockRateLimitOptions = {
        windowMs: 60000,
        max: 100,
      } as any;
      const mockMiddleware = jest.fn();
      (middlewareResolver as jest.Mock).mockReturnValue(mockMiddleware as any);

      // Act
      middleware.addRateLimiter(mockOptions as any);

      // Assert
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline).toHaveLength(1);
      expect(pipeline[0].middleware).toBe(mockMiddleware);
    });
  });

  describe("Edge Cases", () => {
    it("should not add rate limiter middleware if it already exists", () => {
      // Arrange
      const mockOptions: MockRateLimitOptions = {
        windowMs: 60000,
        max: 100,
      } as any;
      const mockMiddleware = jest.fn();
      (middlewareResolver as jest.Mock).mockReturnValue(mockMiddleware as any);

      // Add the middleware once
      middleware.addRateLimiter(mockOptions as any);

      // Act
      middleware.addRateLimiter(mockOptions as any);

      // Assert
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline).toHaveLength(1); // Should still be 1, not added again
    });

    it("should handle undefined options gracefully", () => {
      // Arrange
      const mockMiddleware = jest.fn();
      (middlewareResolver as jest.Mock).mockReturnValue(mockMiddleware as any);

      // Act
      middleware.addRateLimiter(undefined as any);

      // Assert
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline).toHaveLength(1);
      expect(pipeline[0].middleware).toBe(mockMiddleware);
    });

    it("should not add middleware if middlewareResolver returns undefined", () => {
      // Arrange
      (middlewareResolver as jest.Mock).mockReturnValue(undefined);

      // Act
      middleware.addRateLimiter({} as any);

      // Assert
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline).toHaveLength(0);
    });
  });
});

// End of unit tests for: addRateLimiter
