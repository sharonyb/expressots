
// Unit tests for: addUrlEncodedParser


import { OptionsUrlencoded } from "../interfaces/url-encoded.interface";
import { Middleware } from '../middleware-service';


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

interface MockMiddlewarePipeline {
  timestamp: Date;
  middleware: any; // Mocking the middleware as any
}

describe('Middleware.addUrlEncodedParser() addUrlEncodedParser method', () => {
  let middleware: Middleware;
  let mockMiddlewarePipeline: MockMiddlewarePipeline[];

  beforeEach(() => {
    middleware = new Middleware();
    mockMiddlewarePipeline = [];
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should add urlencoded parser middleware when it does not exist', () => {
      const options: OptionsUrlencoded = { extended: true, parameterLimit: 1000 };
      middleware.addUrlEncodedParser(options);

      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

   it('should log a warning if urlencoded parser middleware already exists', () => {
     const options: OptionsUrlencoded = { extended: true, parameterLimit: 1000 };
     middleware.addUrlEncodedParser(options);
     const warnSpy = jest.spyOn(middleware['logger'], 'warn');

     middleware.addUrlEncodedParser(options);
     expect(warnSpy).toHaveBeenCalledWith(
       '[urlencodedParser] already exists. Skipping...',
       'configure-service'
     );
   });
  });

  describe('Edge Cases', () => {
    it('should handle undefined options gracefully', () => {
      middleware.addUrlEncodedParser(undefined);
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it('should handle empty options object', () => {
      middleware.addUrlEncodedParser({});
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].middleware).toBeDefined();
    });

    it('should not add middleware if parameterLimit is exceeded', () => {
      const options: OptionsUrlencoded = { parameterLimit: 0 }; // Invalid limit
      middleware.addUrlEncodedParser(options);
      const pipeline = middleware.getMiddlewarePipeline();
      expect(pipeline.length).toBe(0); // No middleware should be added
    });
  });
});

// End of unit tests for: addUrlEncodedParser

