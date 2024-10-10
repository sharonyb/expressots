// Unit tests for: register

import { BindingScopeEnum } from "inversify";
import { AppFactory } from "../../application";
import { ProviderManager } from "../provider-manager";
import "reflect-metadata";

// Mocking dependencies
type MockServiceIdentifier = {
  name: string;
  version: string;
  author: string;
  repo: string;
};
interface MockContainer {
  isBound: jest.Mock;
  bind: jest.Mock;
}

describe("ProviderManager.register() register method", () => {
  let providerManager: ProviderManager;
  let mockContainer: MockContainer;
  let mockServiceIdentifier: MockServiceIdentifier;

  beforeEach(() => {
    // Initialize mocks
    mockContainer = {
      isBound: jest.fn(),
      bind: jest.fn().mockReturnThis(),
    } as any;

    // Mock the AppFactory to return our mock container
    (AppFactory as any).container = mockContainer;

    providerManager = new ProviderManager();
    mockServiceIdentifier = {
      name: "TestProvider",
      version: "1.0.0",
      author: "Test Author",
      repo: "test/repo",
    } as any;
  });

  describe("Happy Path", () => {
    it("should register a provider with Singleton scope", () => {
      providerManager.register(
        mockServiceIdentifier as any,
        BindingScopeEnum.Singleton,
      );
      expect(mockContainer.bind).toHaveBeenCalledWith(mockServiceIdentifier);
      expect(mockContainer.bind().inSingletonScope).toHaveBeenCalled();
    });

    it("should register a provider with Transient scope", () => {
      providerManager.register(
        mockServiceIdentifier as any,
        BindingScopeEnum.Transient,
      );
      expect(mockContainer.bind).toHaveBeenCalledWith(mockServiceIdentifier);
      expect(mockContainer.bind().inTransientScope).toHaveBeenCalled();
    });

    it("should register a provider with Request scope", () => {
      providerManager.register(
        mockServiceIdentifier as any,
        BindingScopeEnum.Request,
      );
      expect(mockContainer.bind).toHaveBeenCalledWith(mockServiceIdentifier);
      expect(mockContainer.bind().inRequestScope).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should not register a provider that is already bound", () => {
      mockContainer.isBound.mockReturnValue(true);
      providerManager.register(
        mockServiceIdentifier as any,
        BindingScopeEnum.Singleton,
      );
      expect(mockContainer.bind).not.toHaveBeenCalled();
    });

    it("should handle an unrecognized scope gracefully", () => {
      // This test assumes that the method can handle an unrecognized scope without throwing an error
      // Since the method does not have a default case, we can pass an invalid scope
      providerManager.register(
        mockServiceIdentifier as any,
        "InvalidScope" as any,
      );
      expect(mockContainer.bind).toHaveBeenCalledWith(mockServiceIdentifier);
      // No specific behavior is defined for invalid scope, so we just check that it doesn't throw
    });
  });
});

// End of unit tests for: register
