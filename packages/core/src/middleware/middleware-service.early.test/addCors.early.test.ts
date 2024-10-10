// Unit tests for: addCors

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
interface MockCorsOptions {
  origin?: string | string[];
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
}

interface MockMiddlewarePipeline {
  timestamp: Date;
  middleware: any; // Using 'any' to avoid strict type checking
}

// Test suite for addCors method
describe("Middleware.addCors() addCors method", () => {
  let middleware: Middleware;
  let mockCorsOptions: MockCorsOptions;
  let mockMiddlewarePipeline: MockMiddlewarePipeline;

  beforeEach(() => {
    middleware = new Middleware();
    mockCorsOptions = {
      origin: "http://example.com",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type,Authorization",
      exposedHeaders: "Content-Length,ETag",
      credentials: true,
      maxAge: 3600,
    };
    mockMiddlewarePipeline = {
      timestamp: new Date(),
      middleware: jest.fn(),
    };
  });

  // Happy path tests
  describe("Happy Path", () => {
    it("should add CORS middleware when it does not exist", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(
        mockMiddlewarePipeline.middleware as any,
      );

      middleware.addCors(mockCorsOptions);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBe(mockMiddlewarePipeline.middleware);
    });

    it("should not add CORS middleware if it already exists", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(
        mockMiddlewarePipeline.middleware as any,
      );
      middleware.addCors(mockCorsOptions);
      middleware.addCors(mockCorsOptions); // Adding again

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still be 1
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should handle undefined options gracefully", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(
        mockMiddlewarePipeline.middleware as any,
      );
      middleware.addCors(undefined as any); // Passing undefined

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still add the middleware
    });

    it("should handle empty options gracefully", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(
        mockMiddlewarePipeline.middleware as any,
      );
      middleware.addCors({} as any); // Passing empty object

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still add the middleware
    });

    it("should not add CORS middleware if middlewareResolver returns null", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(null);
      middleware.addCors(mockCorsOptions);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(0); // Should not add anything
    });
  });
});

// End of unit tests for: addCors
