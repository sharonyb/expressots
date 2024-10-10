// Unit tests for: viewMiddlewarePipeline

import { Middleware } from "../middleware-service";

// Mocking the middlewareResolver and defaultErrorHandler
jest.mock("../middleware-resolver", () => {
  const actual = jest.requireActual("../middleware-resolver");
  return {
    ...actual,
    middlewareResolver: jest.fn(),
  };
});

jest.mock("../../error/error-handler-middleware", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mocking express types

// Mocking MiddlewarePipeline
interface MockMiddlewarePipeline {
  timestamp: Date;
  middleware: any; // Using 'any' to bypass strict typing
}

describe("Middleware.viewMiddlewarePipeline() viewMiddlewarePipeline method", () => {
  let middleware: Middleware;

  beforeEach(() => {
    middleware = new Middleware();
  });

  describe("Happy Path", () => {
    it("should display the middleware pipeline correctly when there are middlewares added", () => {
      // Arrange
      const mockMiddleware1 = jest.fn();
      const mockMiddleware2 = jest.fn();
      const timestamp1 = new Date();
      const timestamp2 = new Date();

      middleware["middlewarePipeline"] = [
        { timestamp: timestamp1, middleware: mockMiddleware1 },
        { timestamp: timestamp2, middleware: mockMiddleware2 },
      ] as MockMiddlewarePipeline[];

      // Act
      middleware.viewMiddlewarePipeline();

      // Assert
      expect(console.table).toHaveBeenCalledWith([
        {
          timestamp: timestamp1.toISOString(),
          path: "Global",
          middleware: mockMiddleware1.name,
        },
        {
          timestamp: timestamp2.toISOString(),
          path: "Global",
          middleware: mockMiddleware2.name,
        },
      ]);
    });

    it("should handle a middleware configuration object correctly", () => {
      // Arrange
      const mockMiddleware1 = jest.fn();
      const config = {
        path: "/test",
        middlewares: [mockMiddleware1],
      };

      middleware["middlewarePipeline"] = [
        { timestamp: new Date(), middleware: config },
      ] as MockMiddlewarePipeline[];

      // Act
      middleware.viewMiddlewarePipeline();

      // Assert
      expect(console.table).toHaveBeenCalledWith([
        {
          timestamp: expect.any(String),
          path: "/test",
          middleware: `[${mockMiddleware1.name}]`,
        },
      ]);
    });
  });

  describe("Edge Cases", () => {
    it("should log a warning when no middlewares are present", () => {
      // Arrange
      jest.spyOn(console, "warn").mockImplementation(() => {});

      // Act
      middleware.viewMiddlewarePipeline();

      // Assert
      expect(console.warn).toHaveBeenCalledWith(
        "No middlewares in the route [undefined]. Skipping...",
        "configure-service",
      );
    });

    it("should handle an empty middleware configuration object", () => {
      // Arrange
      const config = {
        path: "/empty",
        middlewares: [],
      };

      middleware["middlewarePipeline"] = [
        { timestamp: new Date(), middleware: config },
      ] as MockMiddlewarePipeline[];

      // Act
      middleware.viewMiddlewarePipeline();

      // Assert
      expect(console.warn).toHaveBeenCalledWith(
        "No middlewares in the route [/empty]. Skipping...",
        "configure-service",
      );
    });

    it("should handle multiple middlewares with the same path", () => {
      // Arrange
      const mockMiddleware1 = jest.fn();
      const config = {
        path: "/duplicate",
        middlewares: [mockMiddleware1],
      };

      middleware["middlewarePipeline"] = [
        { timestamp: new Date(), middleware: config },
        { timestamp: new Date(), middleware: config }, // Duplicate
      ] as MockMiddlewarePipeline[];

      // Act
      middleware.viewMiddlewarePipeline();

      // Assert
      expect(console.warn).toHaveBeenCalledWith(
        "[duplicate] route already exists. Skipping...",
        "configure-service",
      );
    });
  });
});

// End of unit tests for: viewMiddlewarePipeline
