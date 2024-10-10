// Unit tests for: getContainerOptions

import { BindingScopeEnum } from "inversify";
import { AppContainer } from "../application-container";
import "reflect-metadata";

// Mock class to simulate the behavior of the Container

describe("AppContainer.getContainerOptions() getContainerOptions method", () => {
  let appContainer: AppContainer;

  beforeEach(() => {
    // Initialize AppContainer with default options
    appContainer = new AppContainer();
  });

  test("should return default container options", () => {
    // This test checks if the default options are returned correctly.
    const options = appContainer.getContainerOptions();
    expect(options.defaultScope).toBe(BindingScopeEnum.Request);
    expect(options.autoBindInjectable).toBe(true);
    expect(options.skipBaseClassChecks).toBeUndefined();
  });

  test("should return custom container options when provided", () => {
    // This test checks if custom options are returned correctly.
    const customOptions = {
      defaultScope: BindingScopeEnum.Singleton,
      skipBaseClassChecks: true,
      autoBindInjectable: false,
    };
    appContainer = new AppContainer(customOptions);
    const options = appContainer.getContainerOptions();
    expect(options.defaultScope).toBe(BindingScopeEnum.Singleton);
    expect(options.skipBaseClassChecks).toBe(true);
    expect(options.autoBindInjectable).toBe(false);
  });

  test("should handle undefined options gracefully", () => {
    // This test checks if the method handles undefined options correctly.
    appContainer = new AppContainer(undefined);
    const options = appContainer.getContainerOptions();
    expect(options.defaultScope).toBe(BindingScopeEnum.Request);
    expect(options.autoBindInjectable).toBe(true);
    expect(options.skipBaseClassChecks).toBeUndefined();
  });

  test("should return options with only defaultScope when other options are not provided", () => {
    // This test checks if only the defaultScope is returned when no other options are provided.
    appContainer = new AppContainer({
      defaultScope: BindingScopeEnum.Transient,
    });
    const options = appContainer.getContainerOptions();
    expect(options.defaultScope).toBe(BindingScopeEnum.Transient);
    expect(options.autoBindInjectable).toBe(true); // Should default to true
    expect(options.skipBaseClassChecks).toBeUndefined(); // Should be undefined
  });
});

// End of unit tests for: getContainerOptions
