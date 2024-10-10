// Unit tests for: find

import { BaseRepository } from "../base-repo.repository";
import { IMemoryDBEntity } from "../db-in-memory.provider";

class MockInMemoryDB {
  public tables: { [key: string]: IMemoryDBEntity[] } = {};

  constructor() {
    this.tables = {};
  }

  getTable(tableName: string): IMemoryDBEntity[] {
    return this.tables[tableName] || [];
  }

  printTable(): void {
    // Mock implementation, no actual logging
  }
}

describe("BaseRepository.find() find method", () => {
  let mockInMemoryDB: MockInMemoryDB;
  let baseRepository: BaseRepository<IMemoryDBEntity>;

  beforeEach(() => {
    mockInMemoryDB = new MockInMemoryDB();
    baseRepository = new BaseRepository<IMemoryDBEntity>("testTable") as any;
    (baseRepository as any).inMemoryDB = mockInMemoryDB; // Injecting the mock
  });

  describe("Happy Path", () => {
    it("should return the entity if it exists", () => {
      // Arrange
      const existingEntity: IMemoryDBEntity = { id: "1" } as any;
      mockInMemoryDB.tables["testTable"] = [existingEntity];

      // Act
      const result = baseRepository.find("1");

      // Assert
      expect(result).toEqual(existingEntity);
    });

    it("should return null if the entity does not exist", () => {
      // Arrange
      mockInMemoryDB.tables["testTable"] = [];

      // Act
      const result = baseRepository.find("1");

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should return null when searching for an empty string as id", () => {
      // Arrange
      const existingEntity: IMemoryDBEntity = { id: "1" } as any;
      mockInMemoryDB.tables["testTable"] = [existingEntity];

      // Act
      const result = baseRepository.find("");

      // Assert
      expect(result).toBeNull();
    });

    it("should return null when searching for a non-existent id", () => {
      // Arrange
      const existingEntity: IMemoryDBEntity = { id: "1" } as any;
      mockInMemoryDB.tables["testTable"] = [existingEntity];

      // Act
      const result = baseRepository.find("2");

      // Assert
      expect(result).toBeNull();
    });

    it("should return null when the table is empty", () => {
      // Arrange
      mockInMemoryDB.tables["testTable"] = [];

      // Act
      const result = baseRepository.find("1");

      // Assert
      expect(result).toBeNull();
    });
  });
});

// End of unit tests for: find
