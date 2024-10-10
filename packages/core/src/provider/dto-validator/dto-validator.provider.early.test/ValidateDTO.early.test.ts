// Unit tests for: ValidateDTO

import { NextFunction, Request, Response } from "express";
import { packageResolver } from "../../../common/package-resolver";
import { StatusCode } from "../../../error/status-code";
import { ValidateDTO } from "../dto-validator.provider";
import "reflect-metadata";

jest.mock("../../../common/package-resolver", () => {
  const actual = jest.requireActual("../../../common/package-resolver");
  return {
    ...actual,
    packageResolver: jest.fn(),
  };
});

const mockValidate = jest.fn();
const mockPlainToClass = jest.fn();
const mockLoggerError = jest.fn();

// jest.mock("class-validator", () => ({
//   validate: mockValidate,
// }));

// jest.mock("class-transformer", () => ({
//   plainToClass: mockPlainToClass,
// }));

jest.mock("../../logger/logger.provider", () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: mockLoggerError,
  })),
}));

describe("ValidateDTO() ValidateDTO method", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("Happy Path", () => {
    it("should call next() when DTO is valid", async () => {
      // Arrange
      const mockDto = { name: "John Doe" };
      req.body = mockDto;
      mockPlainToClass.mockReturnValue(mockDto);
      mockValidate.mockResolvedValue([]);

      const middleware = ValidateDTO(class {});

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should return Bad Request when DTO is invalid", async () => {
      // Arrange
      const mockDto = { name: "John Doe" };
      req.body = mockDto;
      mockPlainToClass.mockReturnValue(mockDto);
      mockValidate.mockResolvedValue([
        {
          property: "name",
          constraints: { isNotEmpty: "name should not be empty" },
        },
      ]);

      const middleware = ValidateDTO(class {});

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCode.BadRequest);
      expect(res.json).toHaveBeenCalledWith({
        errorCode: StatusCode.BadRequest,
        errorMessage: "Bad Request",
        DTO: [{ property: "name", messages: ["name should not be empty"] }],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle exceptions thrown during validation", async () => {
      // Arrange
      const mockDto = { name: "John Doe" };
      req.body = mockDto;
      mockPlainToClass.mockReturnValue(mockDto);
      mockValidate.mockRejectedValue(new Error("Validation error"));

      const middleware = ValidateDTO(class {});

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(mockLoggerError).toHaveBeenCalledWith(
        expect.stringContaining(
          "An exception occurred while validating the DTO:",
        ),
        "validate-dto-provider",
      );
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should call next() if class-validator or class-transformer is not available", async () => {
      // Arrange
      const middleware = ValidateDTO(class {});
      (packageResolver as jest.Mock).mockReturnValueOnce(undefined); // Simulate missing package

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: ValidateDTO
