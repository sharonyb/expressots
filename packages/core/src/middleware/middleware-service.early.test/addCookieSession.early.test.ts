// Unit tests for: addCookieSession

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
interface MockCookieSessionOptions {
  name: string;
  keys: string[];
  maxAge: number;
}

// Test suite
describe("Middleware.addCookieSession() addCookieSession method", () => {
  let middleware: Middleware;

  beforeEach(() => {
    middleware = new Middleware();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should add cookie session middleware successfully", () => {
      const options: MockCookieSessionOptions = {
        name: "session",
        keys: ["key1", "key2"],
        maxAge: 86400000, // 1 day
      };

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addCookieSession(options as any);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it("should not add duplicate cookie session middleware", () => {
      const options: MockCookieSessionOptions = {
        name: "session",
        keys: ["key1", "key2"],
        maxAge: 86400000, // 1 day
      };

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addCookieSession(options as any);
      middleware.addCookieSession(options as any); // Attempt to add again

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still be 1
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle missing options gracefully", () => {
      // No options provided
      middleware.addCookieSession({} as any);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still add a middleware
    });

    it("should not add cookie session middleware if middlewareResolver returns undefined", () => {
      const options: MockCookieSessionOptions = {
        name: "session",
        keys: ["key1", "key2"],
        maxAge: 86400000, // 1 day
      };

      (middlewareResolver as jest.Mock).mockReturnValue(undefined);

      middleware.addCookieSession(options as any);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(0); // Should not add any middleware
    });

    it("should log a warning if trying to add cookie session middleware that already exists", () => {
      const options: MockCookieSessionOptions = {
        name: "session",
        keys: ["key1", "key2"],
        maxAge: 86400000, // 1 day
      };

      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn());

      middleware.addCookieSession(options as any);
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      middleware.addCookieSession(options as any); // Attempt to add again

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("[cookieSession] already exists. Skipping..."),
        "configure-service",
      );

      warnSpy.mockRestore();
    });
  });
});

// End of unit tests for: addCookieSession
