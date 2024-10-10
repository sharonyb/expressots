// Unit tests for: getTable

import { IMemoryDBEntity, InMemoryDB } from "../db-in-memory.provider";

describe("InMemoryDB.getTable() getTable method", () => {
  let db: InMemoryDB;

  beforeEach(() => {
    // Initialize a new instance of InMemoryDB before each test
    db = new InMemoryDB();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should return an empty array when the table does not exist", () => {
      // This test checks that a non-existent table returns an empty array
      const result = db.getTable("nonExistentTable");
      expect(result).toEqual([]);
    });

    it("should return the existing table when it has been created", () => {
      // This test checks that an existing table returns the correct array
      const tableName = "existingTable";
      db.getTable(tableName); // Create the table
      const result = db.getTable(tableName);
      expect(result).toEqual([]);
    });

    it("should allow adding entities to the table and retrieve them", () => {
      // This test checks that entities can be added and retrieved correctly
      const tableName = "entityTable";
      const entity: IMemoryDBEntity = { id: "1" };
      db.getTable(tableName).push(entity); // Add entity to the table
      const result = db.getTable(tableName);
      expect(result).toEqual([entity]);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle table names that are empty strings", () => {
      // This test checks that an empty string as a table name returns an empty array
      const result = db.getTable("");
      expect(result).toEqual([]);
    });

    it("should handle table names that are only whitespace", () => {
      // This test checks that a table name with only whitespace returns an empty array
      const result = db.getTable("   ");
      expect(result).toEqual([]);
    });

    it("should create multiple tables and retrieve them independently", () => {
      // This test checks that multiple tables can be created and retrieved independently
      const tableName1 = "table1";
      const tableName2 = "table2";
      db.getTable(tableName1); // Create first table
      db.getTable(tableName2); // Create second table
      const result1 = db.getTable(tableName1);
      const result2 = db.getTable(tableName2);
      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
    });

    it("should not overwrite existing tables when retrieving", () => {
      // This test checks that retrieving a table does not overwrite existing data
      const tableName = "persistentTable";
      const entity1: IMemoryDBEntity = { id: "1" };
      const entity2: IMemoryDBEntity = { id: "2" };
      db.getTable(tableName).push(entity1); // Add first entity
      db.getTable(tableName); // Retrieve table
      db.getTable(tableName).push(entity2); // Add second entity
      const result = db.getTable(tableName);
      expect(result).toEqual([entity1, entity2]);
    });
  });
});

// End of unit tests for: getTable
