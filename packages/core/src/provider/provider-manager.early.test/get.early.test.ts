// Unit tests for: get

import { ProviderManager } from "../provider-manager";
import "reflect-metadata";

// Mocking the Container interface
interface MockContainer {
  isBound: jest.Mock<boolean>;
  get: jest.Mock<any>;
  bind: jest.Mock<any>;
}

// Mocking the Logger class
class MockLogger {
  warn = jest.fn();
  error = jest.fn();
}

// Test Suite for ProviderManager
describe("ProviderManager.get() get method", () => {
  let providerManager: ProviderManager;
  let mockContainer: MockContainer;
  let mockLogger: MockLogger;

  beforeEach(() => {
    // Initialize mocks
    mockContainer = {
      isBound: jest.fn(),
      get: jest.fn(),
      bind: jest.fn(),
    } as any;

    mockLogger = new MockLogger();

    // Create an instance of ProviderManager with mocked dependencies
    providerManager = new ProviderManager();
    (providerManager as any).container = mockContainer; // Injecting the mock container
    (providerManager as any).logger = mockLogger; // Injecting the mock logger
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should return the registered provider when it is available", () => {
      // Arrange
      const mockProvider = {
        name: "TestProvider",
        version: "1.0",
        author: "Author",
        repo: "Repo",
      };
      mockContainer.get.mockReturnValue(mockProvider as any);

      // Act
      const result = providerManager.get(mockProvider as any);

      // Assert
      expect(result).toEqual(mockProvider);
      expect(mockContainer.get).toHaveBeenCalledWith(mockProvider);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should throw an error when the provider is not registered", () => {
      // Arrange
      const mockProvider = { name: "UnregisteredProvider" };
      mockContainer.get.mockReturnValue(undefined);

      // Act & Assert
      expect(() => providerManager.get(mockProvider as any)).toThrowError(
        `Provider ${mockProvider.name} not registered`,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        `${mockProvider.name} not registered`,
        "provider-manager",
      );
    });

    it("should handle the case when the provider is registered but returns null", () => {
      // Arrange
      const mockProvider = { name: "NullProvider" };
      mockContainer.get.mockReturnValue(null);

      // Act & Assert
      expect(() => providerManager.get(mockProvider as any)).toThrowError(
        `Provider ${mockProvider.name} not registered`,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        `${mockProvider.name} not registered`,
        "provider-manager",
      );
    });
  });
});

// End of unit tests for: get
