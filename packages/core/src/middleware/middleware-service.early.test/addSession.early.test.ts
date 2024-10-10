// Unit tests for: addSession

import { middlewareResolver } from "../middleware-resolver";
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

// Mock interfaces
interface MockSessionOptions {
  secret: string;
  resave: boolean;
  saveUninitialized: boolean;
}

interface MockMiddlewarePipeline {
  timestamp: Date;
  middleware: any; // Adjust as necessary
}

describe("Middleware.addSession() addSession method", () => {
  let middleware: Middleware;
  let mockSessionOptions: MockSessionOptions;
  let mockMiddlewarePipeline: MockMiddlewarePipeline;

  beforeEach(() => {
    middleware = new Middleware();
    mockSessionOptions = {
      secret: "test_secret",
      resave: false,
      saveUninitialized: true,
    };
    mockMiddlewarePipeline = {
      timestamp: new Date(),
      middleware: jest.fn(),
    };
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should add session middleware when it does not exist", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(
        mockMiddlewarePipeline.middleware,
      );

      middleware.addSession(mockSessionOptions as any);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBe(mockMiddlewarePipeline.middleware);
    });

    it("should not add session middleware if it already exists", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(
        mockMiddlewarePipeline.middleware,
      );
      middleware.addSession(mockSessionOptions as any);
      middleware.addSession(mockSessionOptions as any); // Adding again

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still be 1
    });
  });

  // Edge Cases Tests
  describe("Edge Cases", () => {
    it("should handle undefined session options gracefully", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(
        mockMiddlewarePipeline.middleware,
      );
      middleware.addSession(undefined as any); // Passing undefined

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(0); // Should not add anything
    });

    it("should handle empty session options gracefully", () => {
      (middlewareResolver as jest.Mock).mockReturnValue(
        mockMiddlewarePipeline.middleware,
      );
      middleware.addSession({} as any); // Passing empty object

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(0); // Should not add anything
    });
  });
});

// End of unit tests for: addSession
