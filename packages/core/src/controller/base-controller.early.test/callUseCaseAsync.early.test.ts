// Unit tests for: callUseCaseAsync

import { jest } from "@jest/globals";
import { Response } from "express";
import { provide } from "inversify-binding-decorators";
import { BaseController } from "../base-controller";

@provide(ConcreteController)
class ConcreteController extends BaseController {
  // This class can be extended with additional methods if needed
}

describe("BaseController.callUseCaseAsync() callUseCaseAsync method", () => {
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
    it("should return a successful response with status 200 and the result", async () => {
      const mockUseCase = Promise.resolve({ data: "success" });
      await controller.callUseCaseAsync(mockUseCase, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: "success" });
    });

    it("should return a successful response with a custom status code", async () => {
      const mockUseCase = Promise.resolve({ data: "success" });
      await controller.callUseCaseAsync(mockUseCase, mockResponse, 201);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: "success" });
    });
  });

  describe("Edge Cases", () => {
    it("should handle an error thrown by the use case", async () => {
      const mockError = new Error("Use case failed");
      const mockUseCase = Promise.reject(mockError);
      await controller.callUseCaseAsync(mockUseCase, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "An unexpected error occurred.",
        error: "Use case failed",
      });
    });

    it("should handle an unknown error thrown by the use case", async () => {
      const mockUseCase = Promise.reject("Unknown error");
      await controller.callUseCaseAsync(mockUseCase, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "An unexpected error occurred.",
        error: "Unknown error",
      });
    });

    it("should handle a use case that resolves to null", async () => {
      const mockUseCase = Promise.resolve(null);
      await controller.callUseCaseAsync(mockUseCase, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(null);
    });

    it("should handle a use case that resolves to an empty object", async () => {
      const mockUseCase = Promise.resolve({});
      await controller.callUseCaseAsync(mockUseCase, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
  });
});

// End of unit tests for: callUseCaseAsync
