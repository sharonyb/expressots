// Unit tests for: addCookieParser

import { middlewareResolver } from "../middleware-resolver";
import { Middleware } from "../middleware-service";

// Mock interfaces
interface MockCookieParserOptions {
  // Define properties as needed for testing
  someOption: boolean;
}

// Mock the middlewareResolver function
jest.mock("../middleware-resolver", () => {
  const actual = jest.requireActual("../middleware-resolver");
  return {
    ...actual,
    middlewareResolver: jest.fn(),
  };
});

// Mock the defaultErrorHandler function
jest.mock("../../error/error-handler-middleware", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Middleware.addCookieParser() addCookieParser method", () => {
  let middleware: Middleware;

  beforeEach(() => {
    middleware = new Middleware();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should add cookie parser middleware with default options", () => {
      // Arrange
      const mockOptions: MockCookieParserOptions = { someOption: true };
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn() as any);

      // Act
      middleware.addCookieParser(undefined, mockOptions as any);

      // Assert
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it("should add cookie parser middleware with secret", () => {
      // Arrange
      const secret = "mySecret";
      const mockOptions: MockCookieParserOptions = { someOption: true };
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn() as any);

      // Act
      middleware.addCookieParser(secret, mockOptions as any);

      // Assert
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it("should not add cookie parser middleware if it already exists", () => {
      // Arrange
      const secret = "mySecret";
      const mockOptions: MockCookieParserOptions = { someOption: true };
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn() as any);

      // Act
      middleware.addCookieParser(secret, mockOptions as any);
      middleware.addCookieParser(secret, mockOptions as any); // Adding again

      // Assert
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still be 1
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle undefined secret and options gracefully", () => {
      // Arrange
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn() as any);

      // Act
      middleware.addCookieParser(undefined, undefined);

      // Assert
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it("should not add cookie parser middleware if middlewareResolver returns undefined", () => {
      // Arrange
      const secret = "mySecret";
      const mockOptions: MockCookieParserOptions = { someOption: true };
      (middlewareResolver as jest.Mock).mockReturnValue(undefined);

      // Act
      middleware.addCookieParser(secret, mockOptions as any);

      // Assert
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(0); // Should not add anything
    });
  });
});

// End of unit tests for: addCookieParser
