// Unit tests for: update

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

describe("BaseRepository.update() update method", () => {
  let mockInMemoryDB: MockInMemoryDB;
  let baseRepository: BaseRepository<IMemoryDBEntity>;

  beforeEach(() => {
    mockInMemoryDB = new MockInMemoryDB();
    baseRepository = new BaseRepository<IMemoryDBEntity>("testTable") as any;
    (baseRepository as any).inMemoryDB = mockInMemoryDB; // Injecting the mock
  });

  describe("Happy Path", () => {
    it("should update an existing entity and return the updated entity", () => {
      // Arrange
      const existingItem: IMemoryDBEntity = { id: "1", name: "Item 1" } as any;
      mockInMemoryDB.tables["testTable"] = [existingItem];

      const updatedItem: IMemoryDBEntity = {
        id: "1",
        name: "Updated Item 1",
      } as any;

      // Act
      const result = baseRepository.update(updatedItem);

      // Assert
      expect(result).toEqual(updatedItem);
      expect(mockInMemoryDB.tables["testTable"][0]).toEqual(updatedItem);
    });
  });

  describe("Edge Cases", () => {
    it("should return null if the entity does not exist", () => {
      // Arrange
      const nonExistentItem: IMemoryDBEntity = {
        id: "2",
        name: "Non-existent Item",
      } as any;

      // Act
      const result = baseRepository.update(nonExistentItem);

      // Assert
      expect(result).toBeNull();
    });

    it("should not modify the database if the entity does not exist", () => {
      // Arrange
      const nonExistentItem: IMemoryDBEntity = {
        id: "2",
        name: "Non-existent Item",
      } as any;

      // Act
      baseRepository.update(nonExistentItem);

      // Assert
      expect(mockInMemoryDB.tables["testTable"]).toEqual([]);
    });

    it("should handle updating an entity with the same id but different properties", () => {
      // Arrange
      const existingItem: IMemoryDBEntity = { id: "1", name: "Item 1" } as any;
      mockInMemoryDB.tables["testTable"] = [existingItem];

      const updatedItem: IMemoryDBEntity = {
        id: "1",
        name: "Another Update",
      } as any;

      // Act
      const result = baseRepository.update(updatedItem);

      // Assert
      expect(result).toEqual(updatedItem);
      expect(mockInMemoryDB.tables["testTable"][0]).toEqual(updatedItem);
    });
  });
});

// End of unit tests for: update
