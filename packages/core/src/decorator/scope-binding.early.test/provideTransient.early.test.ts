// Unit tests for: provideTransient

import { fluentProvide } from "inversify-binding-decorators";
import { provideTransient } from "../scope-binding";

jest.mock("inversify-binding-decorators", () => ({
  fluentProvide: jest.fn(() => ({
    inTransientScope: jest.fn().mockReturnThis(),
    done: jest.fn(),
  })),
}));

describe("provideTransient() provideTransient method", () => {
  // Happy Path Tests
  describe("Happy Path", () => {
    it("should call fluentProvide with the correct identifier", () => {
      const identifier = Symbol("TestIdentifier");
      provideTransient(identifier);
      expect(fluentProvide).toHaveBeenCalledWith(identifier);
    });

    it("should call inTransientScope on the fluentProvide result", () => {
      const identifier = Symbol("TestIdentifier");
      provideTransient(identifier);
      expect(fluentProvide(identifier).inTransientScope).toHaveBeenCalled();
    });

    it("should call done on the fluentProvide result", () => {
      const identifier = Symbol("TestIdentifier");
      provideTransient(identifier);
      expect(fluentProvide(identifier).done).toHaveBeenCalled();
    });
  });

  // Edge Cases Tests
  describe("Edge Cases", () => {
    it("should handle string identifiers", () => {
      const identifier = "TestIdentifier";
      provideTransient(identifier);
      expect(fluentProvide).toHaveBeenCalledWith(identifier);
    });

    it("should handle class identifiers", () => {
      class TestClass {}
      provideTransient(TestClass);
      expect(fluentProvide).toHaveBeenCalledWith(TestClass);
    });

    it("should handle null identifier", () => {
      const identifier = null;
      provideTransient(identifier);
      expect(fluentProvide).toHaveBeenCalledWith(identifier);
    });

    it("should handle undefined identifier", () => {
      const identifier = undefined;
      provideTransient(identifier);
      expect(fluentProvide).toHaveBeenCalledWith(identifier);
    });

    it("should handle numeric identifiers", () => {
      const identifier = 123;
      provideTransient(identifier);
      expect(fluentProvide).toHaveBeenCalledWith(identifier);
    });

    it("should handle object identifiers", () => {
      const identifier = { key: "value" };
      provideTransient(identifier);
      expect(fluentProvide).toHaveBeenCalledWith(identifier);
    });
  });
});

// End of unit tests for: provideTransient
