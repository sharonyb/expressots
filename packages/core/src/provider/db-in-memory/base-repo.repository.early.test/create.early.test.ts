// Unit tests for: create

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

  // Method to simulate adding a table for testing
  addTable(tableName: string, items: IMemoryDBEntity[]): void {
    this.tables[tableName] = items;
  }
}

describe("BaseRepository.create() create method", () => {
  let mockInMemoryDB: MockInMemoryDB;
  let repository: IBaseRepository<IMemoryDBEntity>;

  beforeEach(() => {
    mockInMemoryDB = new MockInMemoryDB();
    repository = new BaseRepository<IMemoryDBEntity>("testTable") as any;
    (repository as any).inMemoryDB = mockInMemoryDB; // Injecting the mock
  });

  describe("Happy Path", () => {
    it("should create a new entity successfully", () => {
      const newItem: IMemoryDBEntity = { id: "1" } as any; // Mock entity

      const result = repository.create(newItem);

      expect(result).toEqual(newItem);
      expect(mockInMemoryDB.getTable("testTable")).toContain(newItem);
    });
  });

  describe("Edge Cases", () => {
    it("should throw an error if the entity already exists", () => {
      const existingItem: IMemoryDBEntity = { id: "1" } as any; // Mock entity
      mockInMemoryDB.addTable("testTable", [existingItem]);

      const newItem: IMemoryDBEntity = { id: "1" } as any; // Same ID

      expect(() => repository.create(newItem)).toThrowError(
        `Object with id ${newItem.id} already exists`,
      );
    });

    it("should return null if the item is not created due to an error", () => {
      const newItem: IMemoryDBEntity = { id: "2" } as any; // New ID
      const result = repository.create(newItem);

      expect(result).toEqual(newItem);
      expect(mockInMemoryDB.getTable("testTable")).toContain(newItem);
    });

    it("should handle creating multiple entities", () => {
      const firstItem: IMemoryDBEntity = { id: "1" } as any;
      const secondItem: IMemoryDBEntity = { id: "2" } as any;

      repository.create(firstItem);
      const result = repository.create(secondItem);

      expect(result).toEqual(secondItem);
      expect(mockInMemoryDB.getTable("testTable")).toContain(firstItem);
      expect(mockInMemoryDB.getTable("testTable")).toContain(secondItem);
    });
  });
});

// End of unit tests for: create
