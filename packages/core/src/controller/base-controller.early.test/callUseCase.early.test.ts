// Unit tests for: callUseCase

import { Response } from "express";
import { provide } from "inversify-binding-decorators";
import { BaseController } from "../base-controller";

@provide(BaseController)
class ConcreteController extends BaseController {
  // This class can be extended with additional methods if needed
}

export { ConcreteController };
describe("BaseController.callUseCase() callUseCase method", () => {
  let controller: ConcreteController;
  let mockResponse: Response;

  beforeEach(() => {
    controller = new ConcreteController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response; // Type assertion to match Response type
  });

  describe("Happy Path", () => {
    it("should respond with the correct status and JSON when use case is successful", () => {
      const useCaseResult = { data: "success" };
      const successStatusCode = 200;

      // Act
      controller.callUseCase(useCaseResult, mockResponse, successStatusCode);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(successStatusCode);
      expect(mockResponse.json).toHaveBeenCalledWith(useCaseResult);
    });

    it("should respond with default status 200 when no status code is provided", () => {
      const useCaseResult = { data: "success" };

      // Act
      controller.callUseCase(useCaseResult, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(useCaseResult);
    });
  });

  describe("Edge Cases", () => {
    it("should handle and respond with a 500 status when an error occurs", () => {
      const error = new Error("Test error");

      // Mocking the response to throw an error
      jest.spyOn(mockResponse, "json").mockImplementation(() => {
        throw error;
      });

      // Act
      controller.callUseCase(undefined, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "An unexpected error occurred.",
        error: "Test error",
      });
    });

    it("should handle non-Error objects in the error response", () => {
      const error = "Some unexpected error";

      // Mocking the response to throw an error
      jest.spyOn(mockResponse, "json").mockImplementation(() => {
        throw new Error("Mock error");
      });

      // Act
      controller.callUseCase(undefined, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "An unexpected error occurred.",
        error: error,
      });
    });
  });
});

// End of unit tests for: callUseCase
