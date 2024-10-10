// Unit tests for: showTables

import { InMemoryDB } from "../db-in-memory.provider";

describe("InMemoryDB.showTables() showTables method", () => {
  let db: InMemoryDB;
  const originalWrite = process.stdout.write;

  beforeEach(() => {
    db = new InMemoryDB();
    // Mock process.stdout.write to capture output
    process.stdout.write = jest.fn();
  });

  afterEach(() => {
    // Restore original process.stdout.write
    process.stdout.write = originalWrite;
  });

  describe("Happy Path", () => {
    it('should print "No tables exist." when there are no tables', () => {
      // Test the scenario where no tables exist
      db.showTables();
      expect(process.stdout.write).toHaveBeenCalledWith("List of tables:");
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
    });

    it("should print the names of existing tables", () => {
      // Test the scenario where tables exist
      db.getTable("users");
      db.getTable("products");
      db.showTables();
      expect(process.stdout.write).toHaveBeenCalledWith("List of tables:");
      expect(process.stdout.write).toHaveBeenCalledWith("\n- users");
      expect(process.stdout.write).toHaveBeenCalledWith("\n- products");
      expect(process.stdout.write).toHaveBeenCalledTimes(3); // 1 for header + 2 for table names
    });
  });

  describe("Edge Cases", () => {
    it("should handle the case when tables are added after showTables is called", () => {
      // Test the scenario where tables are added after calling showTables
      db.showTables(); // Initially no tables
      db.getTable("orders"); // Add a table after
      db.showTables(); // Call showTables again
      expect(process.stdout.write).toHaveBeenCalledWith("List of tables:");
      expect(process.stdout.write).toHaveBeenCalledWith("\n- orders");
      expect(process.stdout.write).toHaveBeenCalledTimes(3); // 1 for header + 1 for orders
    });

    it("should not throw an error if showTables is called multiple times", () => {
      // Test calling showTables multiple times
      db.showTables();
      db.showTables();
      expect(process.stdout.write).toHaveBeenCalledTimes(2); // Should be called twice
    });

    it("should not print anything if tables object is undefined", () => {
      // Simulate the scenario where tables are undefined
      (db as any).tables = undefined; // Force tables to be undefined
      db.showTables();
      expect(process.stdout.write).toHaveBeenCalledWith("No tables exist.");
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
    });
  });
});

// End of unit tests for: showTables
