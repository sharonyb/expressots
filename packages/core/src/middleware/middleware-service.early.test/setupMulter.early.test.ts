// Unit tests for: setupMulter

import { multer } from "../interfaces/multer.interface";
import { middlewareResolver } from "../middleware-resolver";
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

describe("Middleware.setupMulter() setupMulter method", () => {
  let middleware: Middleware;

  beforeEach(() => {
    middleware = new Middleware();
  });

  describe("Happy Path", () => {
    it("should return multer middleware when called with valid options", () => {
      // Arrange
      const mockOptions: multer.Options = { dest: "uploads/" };
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn() as any);

      // Act
      const result = middleware.setupMulter(mockOptions);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe("function");
      expect(middlewareResolver).toHaveBeenCalledWith("multer", mockOptions);
    });

    it("should return multer middleware when called with no options", () => {
      // Arrange
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn() as any);

      // Act
      const result = middleware.setupMulter();

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe("function");
      expect(middlewareResolver).toHaveBeenCalledWith("multer", undefined);
    });
  });

  describe("Edge Cases", () => {
    it("should return null if multer middleware already exists", () => {
      // Arrange
      const mockOptions: multer.Options = { dest: "uploads/" };
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn() as any);
      middleware.setupMulter(mockOptions); // First call to add middleware

      // Act
      const result = middleware.setupMulter(mockOptions); // Second call with same options

      // Assert
      expect(result).toBeNull();
      expect(middlewareResolver).toHaveBeenCalledTimes(1); // Should only be called once
    });

    it("should return null if multer middleware already exists with no options", () => {
      // Arrange
      (middlewareResolver as jest.Mock).mockReturnValue(jest.fn() as any);
      middleware.setupMulter(); // First call to add middleware

      // Act
      const result = middleware.setupMulter(); // Second call with no options

      // Assert
      expect(result).toBeNull();
      expect(middlewareResolver).toHaveBeenCalledTimes(1); // Should only be called once
    });
  });
});

// End of unit tests for: setupMulter
