// Unit tests for: middlewareResolver

import { middlewareResolver } from "../middleware-resolver";

// Mocking the required middlewares
// jest.mock("cors", () => jest.fn(() => (req, res, next) => next()));
// jest.mock("compression", () => jest.fn(() => (req, res, next) => next()));
// jest.mock("cookie-parser", () => jest.fn(() => (req, res, next) => next()));
// jest.mock("cookie-session", () => jest.fn(() => (req, res, next) => next()));
// jest.mock("serve-favicon", () => jest.fn(() => (req, res, next) => next()));
// jest.mock("morgan", () => jest.fn(() => (req, res, next) => next()));
// jest.mock("helmet", () => jest.fn(() => (req, res, next) => next()));
// jest.mock("express-rate-limit", () =>
//   jest.fn(() => (req, res, next) => next()),
// );
// jest.mock("multer", () => jest.fn(() => (req, res, next) => next()));
// jest.mock("express-session", () => jest.fn(() => (req, res, next) => next()));
// jest.mock("urlencodedParser", () => jest.fn(() => (req, res, next) => next()));

describe("middlewareResolver() middlewareResolver method", () => {
  // Happy Path Tests
  // describe("Happy Path", () => {
  //   it("should return the cors middleware when requested", () => {
  //     const middleware = middlewareResolver("cors");
  //     expect(middleware).toBeDefined();
  //     expect(typeof middleware).toBe("function");
  //   });

  //   it("should return the compression middleware when requested", () => {
  //     const middleware = middlewareResolver("compression");
  //     expect(middleware).toBeDefined();
  //     expect(typeof middleware).toBe("function");
  //   });

  //   it("should return the cookieParser middleware when requested", () => {
  //     const middleware = middlewareResolver("cookieParser");
  //     expect(middleware).toBeDefined();
  //     expect(typeof middleware).toBe("function");
  //   });

  //   it("should return the morgan middleware when requested", () => {
  //     const middleware = middlewareResolver("morgan");
  //     expect(middleware).toBeDefined();
  //     expect(typeof middleware).toBe("function");
  //   });

  //   it("should return the helmet middleware when requested", () => {
  //     const middleware = middlewareResolver("helmet");
  //     expect(middleware).toBeDefined();
  //     expect(typeof middleware).toBe("function");
  //   });
  // });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should return null for an unknown middleware", () => {
      const middleware = middlewareResolver("unknownMiddleware");
      expect(middleware).toBeNull();
    });

    it("should return null for a middleware that is not installed", () => {
      jest.resetModules(); // Clear the module cache
      jest.mock("non-existent-middleware", () => {
        throw new Error("Module not found");
      });

      const middleware = middlewareResolver("non-existent-middleware");
      expect(middleware).toBeNull();
    });

    it('should handle case sensitivity by returning null for "CORS"', () => {
      const middleware = middlewareResolver("CORS");
      expect(middleware).toBeNull();
    });

    it("should return null when no middleware name is provided", () => {
      const middleware = middlewareResolver("");
      expect(middleware).toBeNull();
    });

    it("should return null when middleware name is undefined", () => {
      const middleware = middlewareResolver(undefined);
      expect(middleware).toBeNull();
    });

    it("should return null when middleware name is null", () => {
      const middleware = middlewareResolver(null);
      expect(middleware).toBeNull();
    });
  });
});

// End of unit tests for: middlewareResolver
