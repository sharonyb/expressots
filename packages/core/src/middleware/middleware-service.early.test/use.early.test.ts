// Unit tests for: use

import { NextFunction, Request, Response } from "express";
import { ExpressoMiddleware } from "../middleware-service";

class TestMiddleware extends ExpressoMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Simple middleware logic for testing
    res.locals.test = "test value";
    next();
  }
}

describe("ExpressoMiddleware.use() use method", () => {
  let middleware: TestMiddleware;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    middleware = new TestMiddleware();
    req = {} as Request; // Mock request object
    res = {
      locals: {},
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response; // Mock response object
    next = jest.fn(); // Mock next function
  });

  describe("Happy Path", () => {
    it('should set res.locals.test to "test value" and call next', async () => {
      // This test checks if the middleware sets the correct value and calls next
      await middleware.use(req, res, next);
      expect(res.locals.test).toBe("test value");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should call next even if res.locals is not defined", async () => {
      // This test checks if next is called even when res.locals is not defined
      res.locals = undefined; // Simulate edge case
      await middleware.use(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("should handle errors gracefully if next is not a function", async () => {
      // This test checks if the middleware handles the case where next is not a function
      const invalidNext = null; // Simulate invalid next
      await middleware.use(req, res, invalidNext as unknown as NextFunction);
      expect(res.locals.test).toBe("test value"); // Should still set the value
      // No expectation on next since it's invalid
    });
  });
});

// End of unit tests for: use
