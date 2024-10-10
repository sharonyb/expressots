// Unit tests for: get

import { EnvValidatorProvider } from "../env-validator.provider";

describe("EnvValidatorProvider.get() get method", () => {
  let envValidator: EnvValidatorProvider;

  beforeEach(() => {
    envValidator = new EnvValidatorProvider();
    // Clear the environment variables before each test
    delete process.env.TEST_VAR;
    delete process.env.NUMBER_VAR;
    delete process.env.BOOLEAN_VAR;
  });

  describe("Happy Path", () => {
    it("should return the value of an existing environment variable", () => {
      // Arrange
      process.env.TEST_VAR = "testValue";

      // Act
      const result = envValidator.get("TEST_VAR");

      // Assert
      expect(result).toBe("testValue");
    });

    it("should return the default value if the environment variable is not set", () => {
      // Arrange
      const defaultValue = "defaultValue";

      // Act
      const result = envValidator.get("NON_EXISTENT_VAR", defaultValue);

      // Assert
      expect(result).toBe(defaultValue);
    });

    it("should return undefined if the environment variable is not set and no default value is provided", () => {
      // Act
      const result = envValidator.get("NON_EXISTENT_VAR");

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return a number when the environment variable is a number", () => {
      // Arrange
      process.env.NUMBER_VAR = "123";

      // Act
      const result = envValidator.get("NUMBER_VAR");

      // Assert
      expect(result).toBe("123");
    });

    it("should return a boolean when the environment variable is a boolean string", () => {
      // Arrange
      process.env.BOOLEAN_VAR = "true";

      // Act
      const result = envValidator.get("BOOLEAN_VAR");

      // Assert
      expect(result).toBe("true");
    });
  });

  describe("Edge Cases", () => {
    it("should return the default value when the environment variable is an empty string", () => {
      // Arrange
      process.env.TEST_VAR = "";

      // Act
      const result = envValidator.get("TEST_VAR", "defaultValue");

      // Assert
      expect(result).toBe("defaultValue");
    });

    it("should return undefined when the environment variable is an empty string and no default value is provided", () => {
      // Arrange
      process.env.TEST_VAR = "";

      // Act
      const result = envValidator.get("TEST_VAR");

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return the default value when the environment variable is set to "undefined"', () => {
      // Arrange
      process.env.TEST_VAR = "undefined";

      // Act
      const result = envValidator.get("TEST_VAR", "defaultValue");

      // Assert
      expect(result).toBe("undefined");
    });

    it('should return the default value when the environment variable is set to "null"', () => {
      // Arrange
      process.env.TEST_VAR = "null";

      // Act
      const result = envValidator.get("TEST_VAR", "defaultValue");

      // Assert
      expect(result).toBe("null");
    });

    it('should return the default value when the environment variable is set to "0"', () => {
      // Arrange
      process.env.TEST_VAR = "0";

      // Act
      const result = envValidator.get("TEST_VAR", "defaultValue");

      // Assert
      expect(result).toBe("0");
    });
  });
});

// End of unit tests for: get
