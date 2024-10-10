// Unit tests for: addCompression

import { Request, Response } from "express";
import { middlewareResolver } from "../middleware-resolver";
import { Middleware } from "../middleware-service";

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
interface MockCompressionOptions {
  level: number;
  threshold: number;
  filter: (req: Request, res: Response) => boolean;
}

// Test suite for the addCompression method
describe("Middleware.addCompression() addCompression method", () => {
  let middleware: Middleware;

  beforeEach(() => {
    middleware = new Middleware();
  });

  // Happy path tests
  describe("Happy Path", () => {
    it("should add compression middleware when it does not exist", () => {
      const mockOptions: MockCompressionOptions = {
        level: 6,
        threshold: 1024,
        filter: jest.fn().mockReturnValue(true),
      };

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addCompression(mockOptions as any);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it("should not add compression middleware if it already exists", () => {
      const mockOptions: MockCompressionOptions = {
        level: 6,
        threshold: 1024,
        filter: jest.fn().mockReturnValue(true),
      };

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addCompression(mockOptions as any);
      middleware.addCompression(mockOptions as any); // Adding again

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still be 1
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should handle undefined options gracefully", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addCompression(undefined as any);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still add default compression
    });

    it("should handle null options gracefully", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addCompression(null as any);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still add default compression
    });

    it("should not add compression middleware if middlewareResolver returns null", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(null);

      middleware.addCompression({ level: 6 } as any); // Providing some options

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(0); // Should not add anything
    });
  });
});

// End of unit tests for: addCompression
