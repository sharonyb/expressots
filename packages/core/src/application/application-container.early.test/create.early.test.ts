// Unit tests for: create

import { BindingScopeEnum, Container, ContainerModule } from "inversify";
import { AppContainer } from "../application-container";
import "reflect-metadata";

// Mock class for ContainerModule
class MockContainerModule extends ContainerModule {
  constructor() {
    super((bind) => {
      // Mock binding behavior
      bind("MockService").toConstantValue({}); // Example binding
    });
  }
}

// Unit tests for AppContainer
describe("AppContainer.create() create method", () => {
  let appContainer: AppContainer;

  beforeEach(() => {
    appContainer = new AppContainer();
  });

  // Happy path tests
  describe("Happy Path", () => {
    it("should create a container with default options", () => {
      // Test that the container is created successfully
      const container = appContainer.create([new MockContainerModule() as any]);
      expect(container).toBeInstanceOf(Container);
      expect(container.options.autoBindInjectable).toBe(true);
      expect(container.options.defaultScope).toBe(BindingScopeEnum.Request);
    });

    it("should load multiple modules into the container", () => {
      // Test that multiple modules can be loaded
      const module1 = new MockContainerModule() as any;
      const module2 = new MockContainerModule() as any;
      const container = appContainer.create([module1, module2]);
      expect(container).toBeInstanceOf(Container);
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should handle empty modules array gracefully", () => {
      // Test that passing an empty array does not throw an error
      const container = appContainer.create([]);
      expect(container).toBeInstanceOf(Container);
    });

    it("should throw an error if modules are not instances of ContainerModule", () => {
      // Test that passing non-ContainerModule instances throws an error
      const invalidModule = {} as any; // Not a ContainerModule
      expect(() => appContainer.create([invalidModule])).toThrow();
    });

    it("should allow custom options to be set", () => {
      // Test that custom options can be set
      const customOptions = {
        defaultScope: BindingScopeEnum.Singleton,
        autoBindInjectable: false,
      };
      const customAppContainer = new AppContainer(customOptions);
      const container = customAppContainer.create([
        new MockContainerModule() as any,
      ]);
      expect(container.options.autoBindInjectable).toBe(false);
      expect(container.options.defaultScope).toBe(BindingScopeEnum.Singleton);
    });
  });
});

// End of unit tests for: create
