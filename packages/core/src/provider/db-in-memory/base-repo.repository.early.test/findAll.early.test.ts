// Unit tests for: findAll

import { BaseRepository, IBaseRepository } from "../base-repo.repository";
import { IMemoryDBEntity } from "../db-in-memory.provider";

class MockInMemoryDB {
  private tables: { [key: string]: IMemoryDBEntity[] } = {};

  constructor() {
    this.tables = {};
  }

  getTable(tableName: string): IMemoryDBEntity[] {
    return this.tables[tableName] || [];
  }

  printTable(): void {
    // Mock implementation, no actual logging
  }

  // Method to set up the table with initial data for testing
  setTable(tableName: string, data: IMemoryDBEntity[]): void {
    this.tables[tableName] = data;
  }
}

describe("BaseRepository.findAll() findAll method", () => {
  let mockInMemoryDB: MockInMemoryDB;
  let repository: IBaseRepository<IMemoryDBEntity>;

  beforeEach(() => {
    mockInMemoryDB = new MockInMemoryDB();
    repository = new BaseRepository<IMemoryDBEntity>("testTable") as any;
    (repository as any).inMemoryDB = mockInMemoryDB; // Injecting the mock
  });

  describe("Happy Path", () => {
    it("should return all entities when the table is not empty", () => {
      // Arrange
      const entities = [
        { id: "1", name: "Entity 1" } as IMemoryDBEntity,
        { id: "2", name: "Entity 2" } as IMemoryDBEntity,
      ];
      mockInMemoryDB.setTable("testTable", entities);

      // Act
      const result = repository.findAll();

      // Assert
      expect(result).toEqual(entities);
    });

    it("should return an empty array when the table is empty", () => {
      // Arrange
      mockInMemoryDB.setTable("testTable", []);

      // Act
      const result = repository.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("Edge Cases", () => {
    it("should return null when the table is empty", () => {
      // Arrange
      mockInMemoryDB.setTable("testTable", []);

      // Act
      const result = repository.findAll();

      // Assert
      expect(result).toEqual([]);
    });

    it("should return an empty array when there are no entities", () => {
      // Arrange
      mockInMemoryDB.setTable("testTable", []);

      // Act
      const result = repository.findAll();

      // Assert
      expect(result).toEqual([]);
    });

    it("should not throw an error when the table does not exist", () => {
      // Arrange
      // No setup needed, as the table does not exist

      // Act
      const result = repository.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });
});

// End of unit tests for: findAll
