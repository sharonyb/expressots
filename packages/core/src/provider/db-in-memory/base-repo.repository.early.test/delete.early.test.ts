// Unit tests for: delete

import { BaseRepository, IBaseRepository } from "../base-repo.repository";
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

describe("BaseRepository.delete() delete method", () => {
  let mockInMemoryDB: MockInMemoryDB;
  let repository: IBaseRepository<IMemoryDBEntity>;

  beforeEach(() => {
    mockInMemoryDB = new MockInMemoryDB();
    repository = new BaseRepository<IMemoryDBEntity>("testTable") as any;
    (repository as any).inMemoryDB = mockInMemoryDB; // Injecting the mock
  });

  describe("Happy Path", () => {
    it("should delete an existing entity and return true", () => {
      // Arrange
      const entity = { id: "1" } as IMemoryDBEntity;
      mockInMemoryDB.tables["testTable"] = [entity];

      // Act
      const result = repository.delete("1");

      // Assert
      expect(result).toBe(true);
      expect(mockInMemoryDB.tables["testTable"]).toHaveLength(0);
    });

    it("should delete another existing entity and return true", () => {
      // Arrange
      const entity1 = { id: "1" } as IMemoryDBEntity;
      const entity2 = { id: "2" } as IMemoryDBEntity;
      mockInMemoryDB.tables["testTable"] = [entity1, entity2];

      // Act
      const result = repository.delete("1");

      // Assert
      expect(result).toBe(true);
      expect(mockInMemoryDB.tables["testTable"]).toHaveLength(1);
      expect(mockInMemoryDB.tables["testTable"][0].id).toBe("2");
    });
  });

  describe("Edge Cases", () => {
    it("should return false when trying to delete a non-existing entity", () => {
      // Arrange
      mockInMemoryDB.tables["testTable"] = [{ id: "1" } as IMemoryDBEntity];

      // Act
      const result = repository.delete("2");

      // Assert
      expect(result).toBe(false);
      expect(mockInMemoryDB.tables["testTable"]).toHaveLength(1);
    });

    it("should return false when the table is empty", () => {
      // Arrange
      mockInMemoryDB.tables["testTable"] = [];

      // Act
      const result = repository.delete("1");

      // Assert
      expect(result).toBe(false);
      expect(mockInMemoryDB.tables["testTable"]).toHaveLength(0);
    });
  });
});

// End of unit tests for: delete
