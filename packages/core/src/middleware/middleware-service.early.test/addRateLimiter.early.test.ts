// Unit tests for: addRateLimiter

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
interface MockRateLimitOptions {
  windowMs: number;
  max: number;
}

interface MockMiddlewarePipeline {
  timestamp: Date;
  middleware: any; // Using 'any' to avoid strict type checking
}

//Test suite for addRateLimiter method
describe('Middleware.addRateLimiter() addRateLimiter method', () => {
 let middleware: Middleware;
 let mockRateLimitOptions: MockRateLimitOptions;
 let mockMiddlewarePipeline: MockMiddlewarePipeline;

 beforeEach(() => {
   middleware = new Middleware();
   mockRateLimitOptions = {
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
   };
   mockMiddlewarePipeline = {
     timestamp: new Date(),
     middleware: jest.fn(),
   };
 });

 // Happy path tests
 describe('Happy Path', () => {
   it('should add rate limiter middleware when it does not exist', () => {
     (middlewareResolver as jest.Mock).mockReturnValue(mockMiddlewarePipeline.middleware as any);

     middleware.addRateLimiter(mockRateLimitOptions);

     const pipeline = middleware.getMiddlewarePipeline();
     expect(pipeline.length).toBe(1);
     expect(pipeline[0].middleware).toBe(mockMiddlewarePipeline.middleware);
   });

   it('should not add rate limiter middleware if it already exists', () => {
     (middlewareResolver as jest.Mock).mockReturnValue(mockMiddlewarePipeline.middleware as any);
     middleware.addRateLimiter(mockRateLimitOptions);
     middleware.addRateLimiter(mockRateLimitOptions); // Adding again

     const pipeline = middleware.getMiddlewarePipeline();
     expect(pipeline.length).toBe(1); // Should still be 1
   });
 });

 // Edge case tests
 describe('Edge Cases', () => {
   it('should handle undefined options gracefully', () => {
     (middlewareResolver as jest.Mock).mockReturnValue(mockMiddlewarePipeline.middleware as any);
     middleware.addRateLimiter(undefined as any); // Passing undefined

     const pipeline = middleware.getMiddlewarePipeline();
     expect(pipeline.length).toBe(1); // Should still add the middleware
   });

   it('should not add rate limiter middleware if middlewareResolver returns null', () => {
     (middlewareResolver as jest.Mock).mockReturnValue(null);
     middleware.addRateLimiter(mockRateLimitOptions);

     const pipeline = middleware.getMiddlewarePipeline();
     expect(pipeline.length).toBe(0); // Should not add anything
   });
 });
});

// End of unit tests for: addRateLimiter
