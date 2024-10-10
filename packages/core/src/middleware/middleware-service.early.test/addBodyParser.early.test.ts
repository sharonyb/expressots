// Unit tests for: addBodyParser

import express from "express";
import { IMiddleware, Middleware } from "../middleware-service";

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

interface MockOptionsJson {
  limit: string;
  type: string;
}

interface MockMiddlewarePipeline {
  timestamp: Date;
  middleware: any; // Using 'any' to avoid strict type checking
}

describe("Middleware.addBodyParser() addBodyParser method", () => {
  let middleware: Middleware;
  let mockOptionsJson: MockOptionsJson;
  let mockMiddlewarePipeline: MockMiddlewarePipeline;

  beforeEach(() => {
    middleware = new Middleware();
    mockOptionsJson = {
      limit: "100kb",
      type: "application/json",
    };
    mockMiddlewarePipeline = {
      timestamp: new Date(),
      middleware: express.json(mockOptionsJson) as any,
    };
  });

  test("should add body parser middleware when it does not exist", () => {
    // This test checks the happy path where the body parser is added successfully.
    middleware.addBodyParser(mockOptionsJson as any);
    const pipeline = middleware.getMiddlewarePipeline();
    expect(pipeline.length).toBe(1);
    expect(pipeline[0].middleware).toBe(mockMiddlewarePipeline.middleware);
  });

  test("should not add body parser middleware if it already exists", () => {
    // This test checks that the body parser is not added again if it already exists.
    middleware.addBodyParser(mockOptionsJson as any);
    middleware.addBodyParser(mockOptionsJson as any); // Attempt to add again
    const pipeline = middleware.getMiddlewarePipeline();
    expect(pipeline.length).toBe(1); // Should still be 1
  });

  test("should log a warning if body parser middleware already exists", () => {
    // This test checks that a warning is logged when trying to add an existing middleware.
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    middleware.addBodyParser(mockOptionsJson as any);
    middleware.addBodyParser(mockOptionsJson as any); // Attempt to add again
    expect(warnSpy).toHaveBeenCalledWith(
      "[jsonParser] already exists. Skipping...",
      "configure-service",
    );
    warnSpy.mockRestore();
  });

  test("should handle undefined options gracefully", () => {
    // This test checks that the method can handle undefined options without throwing errors.
    middleware.addBodyParser(undefined as any);
    const pipeline = middleware.getMiddlewarePipeline();
    expect(pipeline.length).toBe(1); // Should still be 1
  });

  test("should handle null options gracefully", () => {
    // This test checks that the method can handle null options without throwing errors.
    middleware.addBodyParser(null as any);
    const pipeline = middleware.getMiddlewarePipeline();
    expect(pipeline.length).toBe(1); // Should still be 1
  });

  test("should add body parser middleware with default options if none provided", () => {
    // This test checks that the method adds a body parser with default options if none are provided.
    middleware.addBodyParser(); // No options provided
    const pipeline = middleware.getMiddlewarePipeline();
    expect(pipeline.length).toBe(1); // Should still be 1
    expect(pipeline[0].middleware).toBeDefined(); // Middleware should be defined
  });
});

// End of unit tests for: addBodyParser
