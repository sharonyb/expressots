// Unit tests for: viewContainerBindings

import { BindingScopeEnum } from "inversify";
import { AppContainer } from "../application-container";
import "reflect-metadata";

class MockBinding {
  public id: number = 1;
  public activated: boolean = true;
  public serviceIdentifier: symbol = Symbol("MockService");
  public scope: string = BindingScopeEnum.Singleton;
  public type: string = "Instance";
  public constraint: object = {};
  public implementationType: object = {};
  public cache: object | null = {};
  public factory: object | null = null;
  public provider: object | null = null;
  public onActivation: object | null = null;
  public onDeactivation: object | null = null;
  public dynamicValue: object | null = null;
  public moduleId: number = 1;
}

class MockContainer {
  public _bindingDictionary = {
    _map: new Map<string, Array<MockBinding>>(),
  };

  constructor() {
    const mockBinding = new MockBinding();
    this._bindingDictionary._map.set(mockBinding.serviceIdentifier.toString(), [
      mockBinding,
    ]);
  }
}

describe("AppContainer.viewContainerBindings() viewContainerBindings method", () => {
  let appContainer: AppContainer;

  beforeEach(() => {
    // Initialize AppContainer with a mock container
    appContainer = new AppContainer();
    (appContainer as any).container = new MockContainer() as any;
  });

  test("should display the binding dictionary correctly", () => {
    // This test checks the happy path where the container has bindings
    console.table = jest.fn(); // Mock console.table

    appContainer.viewContainerBindings();

    expect(console.table).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          "Service Identifier": expect.any(String),
          Scope: expect.any(String),
          Type: expect.any(String),
          Cache: expect.any(String),
        }),
      ]),
    );
  });

  test("should handle empty binding dictionary gracefully", () => {
    // This test checks the edge case where there are no bindings
    (appContainer as any).container._bindingDictionary._map.clear(); // Clear bindings
    console.table = jest.fn(); // Mock console.table

    appContainer.viewContainerBindings();

    expect(console.table).toHaveBeenCalledWith([]); // Expect an empty array
  });

  test("should handle bindings with null cache", () => {
    // This test checks the edge case where bindings have null cache
    const mockBinding = new MockBinding();
    mockBinding.cache = null; // Set cache to null
    (appContainer as any).container._bindingDictionary._map.set(
      mockBinding.serviceIdentifier.toString(),
      [mockBinding],
    );
    console.table = jest.fn(); // Mock console.table

    appContainer.viewContainerBindings();

    expect(console.table).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          "Service Identifier": mockBinding.serviceIdentifier.toString(),
          Cache: "No", // Expect "No" for null cache
        }),
      ]),
    );
  });

  test("should handle multiple bindings for the same service identifier", () => {
    // This test checks the edge case where there are multiple bindings for the same identifier
    const mockBinding1 = new MockBinding();
    const mockBinding2 = new MockBinding();
    mockBinding2.id = 2; // Different ID for the second binding
    (appContainer as any).container._bindingDictionary._map.set(
      mockBinding1.serviceIdentifier.toString(),
      [mockBinding1, mockBinding2],
    );
    console.table = jest.fn(); // Mock console.table

    appContainer.viewContainerBindings();

    expect(console.table).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          "Service Identifier": mockBinding1.serviceIdentifier.toString(),
          Scope: mockBinding1.scope,
          Type: mockBinding1.type,
          Cache: mockBinding1.cache !== null ? "Yes" : "No",
        }),
        expect.objectContaining({
          "Service Identifier": mockBinding2.serviceIdentifier.toString(),
          Scope: mockBinding2.scope,
          Type: mockBinding2.type,
          Cache: mockBinding2.cache !== null ? "Yes" : "No",
        }),
      ]),
    );
  });
});

// End of unit tests for: viewContainerBindings
