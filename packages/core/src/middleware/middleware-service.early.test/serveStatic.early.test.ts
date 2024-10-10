// Unit tests for: serveStatic

import { Response } from "express";
import defaultErrorHandler from "../../error/error-handler-middleware";
import { middlewareResolver } from "../middleware-resolver";
import { IMiddleware, Middleware } from "../middleware-service";

// Mocking the middlewareResolver function
jest.mock("../middleware-resolver", () => {
  const actual = jest.requireActual("../middleware-resolver");
  return {
    ...actual,
    middlewareResolver: jest.fn(),
  };
});

// Mocking the defaultErrorHandler function
jest.mock("../../error/error-handler-middleware", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock interfaces
interface MockServeStaticOptions {
  setHeaders?: (res: Response, path: string, stat: any) => void;
  maxAge?: number;
}

interface MockMiddlewarePipeline {
  timestamp: Date;
  middleware: any; // Using 'any' to avoid strict type checking
}

// Test suite for the serveStatic method
describe("Middleware.serveStatic() serveStatic method", () => {
  let middleware: IMiddleware;
  let mockServeStaticOptions: MockServeStaticOptions;
  let mockMiddlewarePipeline: MockMiddlewarePipeline[];

  beforeEach(() => {
    middleware = new Middleware();
    mockMiddlewarePipeline = [];
    mockServeStaticOptions = {
      setHeaders: jest.fn(),
      maxAge: 3600,
    };
  });

  it("should add serveStatic middleware successfully", () => {
    // Arrange
    const root = "public";
    const options = mockServeStaticOptions;

    // Act
    middleware.serveStatic(root, options);

    // Assert
    const pipeline = middleware.getMiddlewarePipeline();
    expect(pipeline.length).toBe(1);
    expect(pipeline[0].middleware).toBeDefined();
    expect(middlewareResolver).toHaveBeenCalledWith("static", root, options);
  });

  it("should log a warning if serveStatic middleware already exists", () => {
    // Arrange
    const root = "public";
    const options = mockServeStaticOptions;

    // Act
    middleware.serveStatic(root, options); // First call
    middleware.serveStatic(root, options); // Second call (should log warning)

    // Assert
    expect(middlewareResolver).toHaveBeenCalledTimes(1); // Should only be called once
    expect(defaultErrorHandler).not.toHaveBeenCalled(); // No error should be logged
  });

  it("should handle undefined options gracefully", () => {
    // Arrange
    const root = "public";

    // Act
    middleware.serveStatic(root, undefined);

    // Assert
    const pipeline = middleware.getMiddlewarePipeline();
    expect(pipeline.length).toBe(1);
    expect(pipeline[0].middleware).toBeDefined();
  });

  it("should handle empty root path gracefully", () => {
    // Arrange
    const root = "";

    // Act
    middleware.serveStatic(root, mockServeStaticOptions);

    // Assert
    const pipeline = middleware.getMiddlewarePipeline();
    expect(pipeline.length).toBe(1);
    expect(pipeline[0].middleware).toBeDefined();
  });

  it("should not add middleware if root is null", () => {
    // Arrange
    const root = null as any; // Casting to any to bypass type checking

    // Act
    middleware.serveStatic(root, mockServeStaticOptions);

    // Assert
    const pipeline = middleware.getMiddlewarePipeline();
    expect(pipeline.length).toBe(0); // No middleware should be added
  });
});

// End of unit tests for: serveStatic
