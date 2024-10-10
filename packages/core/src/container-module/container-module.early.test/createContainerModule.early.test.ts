// Unit tests for: createContainerModule

import { BindingScopeEnum, ContainerModule, interfaces } from "inversify";
import { BINDING_TYPE_METADATA_KEY, CreateModule } from "../container-module";

// Mock types
type MockBindingScope = {
  Singleton: interfaces.BindingScope;
  Transient: interfaces.BindingScope;
  Request: interfaces.BindingScope;
};

const mockBindingScope: MockBindingScope = {
  Singleton: BindingScopeEnum.Singleton,
  Transient: BindingScopeEnum.Transient,
  Request: BindingScopeEnum.Request,
};

const mockController: any = class MockController {};

describe("BaseModule.createContainerModule() createContainerModule method", () => {
  beforeEach(() => {
    // Clear any existing metadata before each test
    jest.clearAllMocks();
    jest.resetModules();
  });

  // Happy path tests
  describe("Happy Path", () => {
    it("should create a ContainerModule with provided controllers and default scope", () => {
      // Arrange
      const controllers = [mockController];
      Reflect.defineMetadata(
        BINDING_TYPE_METADATA_KEY,
        mockBindingScope.Singleton,
        mockController,
      );

      // Act
      const module = CreateModule(controllers);

      // Assert
      expect(module).toBeInstanceOf(ContainerModule);
    });

    it("should create a ContainerModule with provided controllers and specified scope", () => {
      // Arrange
      const controllers = [mockController];

      // Act
      const module = CreateModule(controllers, mockBindingScope.Transient);

      // Assert
      expect(module).toBeInstanceOf(ContainerModule);
    });

    // it("should bind controllers to the correct scope", () => {
    //   // Arrange
    //   const controllers = [mockController];
    //   const bindMock = jest.fn();
    //   const module = CreateModule(controllers, mockBindingScope.Singleton);

    //   // Act
    //   module.register(bindMock as any);

    //   // Assert
    //   expect(bindMock).toHaveBeenCalledWith(expect.any(Symbol));
    //   expect(bindMock.mock.calls[0][0]).toBe(Symbol.for("MockController"));
    // });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should handle an empty array of controllers", () => {
      // Arrange
      const controllers: any[] = [];

      // Act
      const module = CreateModule(controllers);

      // Assert
      expect(module).toBeInstanceOf(ContainerModule);
    });

    it("should handle undefined scope", () => {
      // Arrange
      const controllers = [mockController];
      Reflect.defineMetadata(
        BINDING_TYPE_METADATA_KEY,
        mockBindingScope.Singleton,
        mockController,
      );

      // Act
      const module = CreateModule(controllers, undefined);

      // Assert
      expect(module).toBeInstanceOf(ContainerModule);
    });

    // it("should bind to default scope if no metadata is defined", () => {
    //   // Arrange
    //   const controllers = [mockController];
    //   const bindMock = jest.fn();
    //   const module = CreateModule(controllers);

    //   // Act
    //   module.register(bindMock as any);

    //   // Assert
    //   expect(bindMock).toHaveBeenCalledWith(expect.any(Symbol));
    //   expect(bindMock.mock.calls[0][0]).toBe(Symbol.for("MockController"));
    // });

    it("should throw an error if an invalid controller is provided", () => {
      // Arrange
      const controllers = [null as any]; // Invalid controller

      // Act & Assert
      expect(() => CreateModule(controllers)).toThrow();
    });
  });
});

// End of unit tests for: createContainerModule
