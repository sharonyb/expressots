// Unit tests for: bindToScope

import { BindingScopeEnum } from "inversify";
import { provideTransient } from "../../decorator";
import { BaseModule } from "../container-module";

// Mock types
type MockBindingScope = {
  inSingletonScope: jest.Mock;
  inTransientScope: jest.Mock;
  inRequestScope: jest.Mock;
};

type MockBind = {
  to: jest.Mock;
};

// Initialize mocks
const mockBindingScope: MockBindingScope = {
  inSingletonScope: jest.fn(),
  inTransientScope: jest.fn(),
  inRequestScope: jest.fn(),
};

const mockBind: MockBind = {
  to: jest.fn().mockReturnValue(mockBindingScope),
};

describe("BaseModule.bindToScope() bindToScope method", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock calls
  });

  // Happy path tests
  describe("Happy Path", () => {
    it("should bind to singleton scope correctly", () => {
      const symbol = Symbol("TestSymbol");
      const target = class {};
      const bindingType = BindingScopeEnum.Singleton;

      BaseModule.bindToScope(
        symbol,
        target as any,
        bindingType,
        mockBind as any,
      );

      expect(mockBind.to).toHaveBeenCalledWith(target);
      expect(mockBindingScope.inSingletonScope).toHaveBeenCalled();
    });

    it("should bind to transient scope correctly", () => {
      const symbol = Symbol("TestSymbol");
      const target = class {};
      const bindingType = BindingScopeEnum.Transient;

      BaseModule.bindToScope(
        symbol,
        target as any,
        bindingType,
        mockBind as any,
      );

      expect(mockBind.to).toHaveBeenCalledWith(target);
      expect(mockBindingScope.inTransientScope).toHaveBeenCalled();
      expect(provideTransient).toHaveBeenCalledWith(target);
    });

    it("should bind to request scope correctly", () => {
      const symbol = Symbol("TestSymbol");
      const target = class {};
      const bindingType = BindingScopeEnum.Request;

      BaseModule.bindToScope(
        symbol,
        target as any,
        bindingType,
        mockBind as any,
      );

      expect(mockBind.to).toHaveBeenCalledWith(target);
      expect(mockBindingScope.inRequestScope).toHaveBeenCalled();
    });

    it("should bind to default request scope when binding type is unknown", () => {
      const symbol = Symbol("TestSymbol");
      const target = class {};
      const bindingType = "UnknownBindingType" as any; // Simulating an unknown binding type

      BaseModule.bindToScope(
        symbol,
        target as any,
        bindingType,
        mockBind as any,
      );

      expect(mockBind.to).toHaveBeenCalledWith(target);
      expect(mockBindingScope.inRequestScope).toHaveBeenCalled();
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should handle undefined target gracefully", () => {
      const symbol = Symbol("TestSymbol");
      const bindingType = BindingScopeEnum.Singleton;

      expect(() => {
        BaseModule.bindToScope(
          symbol,
          undefined as any,
          bindingType,
          mockBind as any,
        );
      }).toThrow(); // Expecting an error due to undefined target
    });

    it("should handle null target gracefully", () => {
      const symbol = Symbol("TestSymbol");
      const bindingType = BindingScopeEnum.Singleton;

      expect(() => {
        BaseModule.bindToScope(
          symbol,
          null as any,
          bindingType,
          mockBind as any,
        );
      }).toThrow(); // Expecting an error due to null target
    });

    it("should handle invalid binding type gracefully", () => {
      const symbol = Symbol("TestSymbol");
      const target = class {};
      const bindingType = "InvalidBindingType" as any; // Simulating an invalid binding type

      BaseModule.bindToScope(
        symbol,
        target as any,
        bindingType,
        mockBind as any,
      );

      expect(mockBind.to).toHaveBeenCalledWith(target);
      expect(mockBindingScope.inRequestScope).toHaveBeenCalled(); // Should default to request scope
    });
  });
});

// End of unit tests for: bindToScope
