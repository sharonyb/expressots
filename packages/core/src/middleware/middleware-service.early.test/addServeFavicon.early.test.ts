// Unit tests for: addServeFavicon

import { ServeFaviconOptions } from "../interfaces/serve-favicon.interface";
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

interface MockMiddlewarePipeline {
  timestamp: Date;
  middleware: any; // This can be any type of middleware
}

// Test suite for addServeFavicon method
describe("Middleware.addServeFavicon() addServeFavicon method", () => {
  let middleware: Middleware;
  let mockMiddlewarePipeline: MockMiddlewarePipeline[];

  beforeEach(() => {
    middleware = new Middleware();
    mockMiddlewarePipeline = [];
    jest.clearAllMocks();
  });

  // Happy path tests
  describe("Happy Path", () => {
    it("should add favicon middleware when valid path is provided", () => {
      const path = "path/to/favicon.ico";
      const options: ServeFaviconOptions = { maxAge: 86400000 }; // 1 day

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addServeFavicon(path, options);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it("should add favicon middleware when valid Buffer is provided", () => {
      const path = Buffer.from("favicon data");
      const options: ServeFaviconOptions = { maxAge: 86400000 }; // 1 day

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addServeFavicon(path, options);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should not add favicon middleware if it already exists", () => {
      const path = "path/to/favicon.ico";
      const options: ServeFaviconOptions = { maxAge: 86400000 }; // 1 day

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addServeFavicon(path, options);
      middleware.addServeFavicon(path, options); // Adding again

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still be 1
    });

    it("should handle undefined options gracefully", () => {
      const path = "path/to/favicon.ico";

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addServeFavicon(path, undefined);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it("should handle empty string as path", () => {
      const path = "";

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addServeFavicon(path);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it("should handle invalid path gracefully", () => {
      const path = null as any; // Invalid path

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addServeFavicon(path);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });
  });
});

// End of unit tests for: addServeFavicon
