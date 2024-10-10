// Unit tests for: scope

import { BindingScopeEnum } from "inversify";
import { BINDING_TYPE_METADATA_KEY, scope } from "../container-module";
import "reflect-metadata";

describe("scope() scope method", () => {
  // Mocking the provide, provideSingleton, and provideTransient functions
  const provideMock = jest.fn();
  const provideSingletonMock = jest.fn();
  const provideTransientMock = jest.fn();

  beforeAll(() => {
    // Mock the functions to avoid actual implementation calls
    jest.mock("inversify-binding-decorators", () => ({
      provide: provideMock,
      provideSingleton: provideSingletonMock,
      provideTransient: provideTransientMock,
    }));
  });

  beforeEach(() => {
    // Clear mocks and metadata before each test
    jest.clearAllMocks();
    Reflect.deleteMetadata(BINDING_TYPE_METADATA_KEY, TestClass);
  });

  class TestClass {}

  describe("Happy Path", () => {
    it("should define metadata and call provideSingleton for Singleton scope", () => {
      const decorator = scope(BindingScopeEnum.Singleton);
      decorator(TestClass);

      expect(Reflect.hasMetadata(BINDING_TYPE_METADATA_KEY, TestClass)).toBe(
        true,
      );
      expect(Reflect.getMetadata(BINDING_TYPE_METADATA_KEY, TestClass)).toBe(
        BindingScopeEnum.Singleton,
      );
      expect(provideSingletonMock).toHaveBeenCalledWith(TestClass);
    });

    it("should define metadata and call provideTransient for Transient scope", () => {
      const decorator = scope(BindingScopeEnum.Transient);
      decorator(TestClass);

      expect(Reflect.hasMetadata(BINDING_TYPE_METADATA_KEY, TestClass)).toBe(
        true,
      );
      expect(Reflect.getMetadata(BINDING_TYPE_METADATA_KEY, TestClass)).toBe(
        BindingScopeEnum.Transient,
      );
      expect(provideTransientMock).toHaveBeenCalledWith(TestClass);
    });

    it("should define metadata and call provide for default scope", () => {
      const decorator = scope(BindingScopeEnum.Request);
      decorator(TestClass);

      expect(Reflect.hasMetadata(BINDING_TYPE_METADATA_KEY, TestClass)).toBe(
        true,
      );
      expect(Reflect.getMetadata(BINDING_TYPE_METADATA_KEY, TestClass)).toBe(
        BindingScopeEnum.Request,
      );
      expect(provideMock).toHaveBeenCalledWith(TestClass);
    });

    // it("should not redefine metadata if already defined", () => {
    //   const decorator = scope(BindingScopeEnum.Singleton);
    //   decorator(TestClass);
    //   decorator(BindingScopeEnum.Transient)(TestClass); // Call again with a different scope

    //   expect(Reflect.getMetadata(BINDING_TYPE_METADATA_KEY, TestClass)).toBe(
    //     BindingScopeEnum.Singleton,
    //   );
    //   expect(provideSingletonMock).toHaveBeenCalledTimes(1); // Should still only call once
    //   expect(provideTransientMock).toHaveBeenCalledTimes(0); // Should not call provideTransient
    // });
  });

  describe("Edge Cases", () => {
    it("should handle undefined binding gracefully", () => {
      const decorator = scope(undefined as any);
      decorator(TestClass);

      expect(Reflect.hasMetadata(BINDING_TYPE_METADATA_KEY, TestClass)).toBe(
        true,
      );
      expect(
        Reflect.getMetadata(BINDING_TYPE_METADATA_KEY, TestClass),
      ).toBeUndefined();
      expect(provideMock).toHaveBeenCalledWith(TestClass);
    });

    it("should handle null binding gracefully", () => {
      const decorator = scope(null as any);
      decorator(TestClass);

      expect(Reflect.hasMetadata(BINDING_TYPE_METADATA_KEY, TestClass)).toBe(
        true,
      );
      expect(
        Reflect.getMetadata(BINDING_TYPE_METADATA_KEY, TestClass),
      ).toBeNull();
      expect(provideMock).toHaveBeenCalledWith(TestClass);
    });

    it("should not throw error when called multiple times with the same target", () => {
      const decorator = scope(BindingScopeEnum.Singleton);
      decorator(TestClass);
      expect(() => {
        decorator(TestClass);
      }).not.toThrow();
    });
  });
});

// End of unit tests for: scope
