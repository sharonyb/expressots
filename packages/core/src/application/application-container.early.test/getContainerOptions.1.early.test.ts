// Unit tests for: getContainerOptions

import { BindingScopeEnum, interfaces } from "inversify";
import { AppContainer } from "../application-container";
import "reflect-metadata";

// Mock class to simulate the behavior of the Container
class MockContainer {
  public options: interfaces.ContainerOptions;

  constructor(options: interfaces.ContainerOptions) {
    this.options = options;
  }
}

describe("AppContainer.getContainerOptions() getContainerOptions method", () => {
  let appContainer: AppContainer;

  beforeEach(() => {
    // Initialize AppContainer with default options
    appContainer = new AppContainer();
    // Mock the container property to return a MockContainer instance
    (appContainer as any).container = new MockContainer({
      defaultScope: BindingScopeEnum.Request,
      autoBindInjectable: true,
      skipBaseClassChecks: false,
    });
  });

  describe("Happy Path", () => {
    it("should return the correct container options", () => {
      // This test checks if the method returns the expected options
      const options = appContainer.getContainerOptions();
      expect(options.defaultScope).toBe(BindingScopeEnum.Request);
      expect(options.autoBindInjectable).toBe(true);
      expect(options.skipBaseClassChecks).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should throw an error if the container is not initialized", () => {
      // This test checks if an error is thrown when the container is not initialized
      (appContainer as any).container = undefined; // Simulate uninitialized container
      expect(() => appContainer.getContainerOptions()).toThrowError(
        "Container is not initialized",
      );
    });

    it("should return options with autoBindInjectable set to false", () => {
      // This test checks if the method correctly returns options when autoBindInjectable is false
      (appContainer as any).container = new MockContainer({
        defaultScope: BindingScopeEnum.Request,
        autoBindInjectable: false,
        skipBaseClassChecks: true,
      });
      const options = appContainer.getContainerOptions();
      expect(options.autoBindInjectable).toBe(false);
      expect(options.skipBaseClassChecks).toBe(true);
    });

    it("should return options with defaultScope set to Singleton", () => {
      // This test checks if the method correctly returns options when defaultScope is Singleton
      (appContainer as any).container = new MockContainer({
        defaultScope: BindingScopeEnum.Singleton,
        autoBindInjectable: true,
        skipBaseClassChecks: false,
      });
      const options = appContainer.getContainerOptions();
      expect(options.defaultScope).toBe(BindingScopeEnum.Singleton);
    });
  });
});

// End of unit tests for: getContainerOptions
