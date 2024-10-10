// Unit tests for: getMiddlewarePipeline

import { NextFunction, Request, Response } from "express";
import { Middleware } from "../middleware-service";

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

describe("Middleware.getMiddlewarePipeline() getMiddlewarePipeline method", () => {
  let middleware: Middleware;

  beforeEach(() => {
    middleware = new Middleware();
  });

  describe("getMiddlewarePipeline - Happy Path", () => {
    it("should return an empty pipeline when no middleware has been added", () => {
      // This test checks that the middleware pipeline is empty initially.
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline).toEqual([]);
    });

    it("should return the middleware pipeline with one middleware added", () => {
      // This test checks that the middleware pipeline contains the added middleware.
      const mockMiddleware = jest.fn(
        (req: Request, res: Response, next: NextFunction) => next(),
      );
      middleware.addMiddleware(mockMiddleware);
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBe(mockMiddleware);
    });

    it("should return the middleware pipeline with multiple middlewares added", () => {
      // This test checks that the middleware pipeline contains all added middlewares.
      const mockMiddleware1 = jest.fn(
        (req: Request, res: Response, next: NextFunction) => next(),
      );
      const mockMiddleware2 = jest.fn(
        (req: Request, res: Response, next: NextFunction) => next(),
      );
      middleware.addMiddleware(mockMiddleware1);
      middleware.addMiddleware(mockMiddleware2);
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(2);
      expect(pipeline[0].middleware).toBe(mockMiddleware1);
      expect(pipeline[1].middleware).toBe(mockMiddleware2);
    });
  });

  describe("getMiddlewarePipeline - Edge Cases", () => {
    it("should not add the same middleware multiple times", () => {
      // This test checks that the same middleware is not added multiple times.
      const mockMiddleware = jest.fn(
        (req: Request, res: Response, next: NextFunction) => next(),
      );
      middleware.addMiddleware(mockMiddleware);
      middleware.addMiddleware(mockMiddleware); // Attempt to add the same middleware again
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1); // Should still be 1
    });

    it("should handle adding a middleware configuration object", () => {
      // This test checks that a middleware configuration object is added correctly.
      const mockMiddleware = jest.fn(
        (req: Request, res: Response, next: NextFunction) => next(),
      );
      const middlewareConfig = {
        path: "/test",
        middlewares: [mockMiddleware],
      };
      middleware.addMiddleware(middlewareConfig);
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toEqual(middlewareConfig);
    });

    it("should log a warning when trying to add a middleware with an empty path", () => {
      // This test checks that a warning is logged when trying to add a middleware with an empty path.
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
      const middlewareConfig = {
        path: "",
        middlewares: [],
      };
      middleware.addMiddleware(middlewareConfig);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "No middlewares in the route []. Skipping...",
        "configure-service",
      );
      consoleWarnSpy.mockRestore();
    });

    it("should return the middleware pipeline sorted by timestamp", () => {
      // This test checks that the middleware pipeline is sorted by the timestamp when added.
      const mockMiddleware1 = jest.fn(
        (req: Request, res: Response, next: NextFunction) => next(),
      );
      const mockMiddleware2 = jest.fn(
        (req: Request, res: Response, next: NextFunction) => next(),
      );
      middleware.addMiddleware(mockMiddleware1);
      // Simulate a delay to ensure the second middleware has a later timestamp
      jest.advanceTimersByTime(1000);
      middleware.addMiddleware(mockMiddleware2);
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline[0].middleware).toBe(mockMiddleware1);
      expect(pipeline[1].middleware).toBe(mockMiddleware2);
    });
  });
});

// End of unit tests for: getMiddlewarePipeline
