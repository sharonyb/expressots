// Unit tests for: printTable

import { IMemoryDBEntity, InMemoryDB } from "../db-in-memory.provider";

describe("InMemoryDB.printTable() printTable method", () => {
  let db: InMemoryDB;
  const originalWrite = process.stdout.write;

  beforeEach(() => {
    db = new InMemoryDB();
    // Mocking process.stdout.write to capture console output
    process.stdout.write = jest.fn();
  });

  afterEach(() => {
    // Restore original process.stdout.write
    process.stdout.write = originalWrite;
  });

  describe("Happy Path", () => {
    it("should print records in a non-empty table", () => {
      // Arrange
      const tableName = "users";
      const entities: IMemoryDBEntity[] = [{ id: "1" }, { id: "2" }];
      db.getTable(tableName).push(...entities);

      // Act
      db.printTable(tableName);

      // Assert
      expect(process.stdout.write).toHaveBeenCalledWith(
        `\nRecords in table '${tableName}':\n`,
      );
      expect(console.table).toHaveBeenCalledWith(entities);
    });

    it("should create a table if it does not exist and print it", () => {
      // Arrange
      const tableName = "products";
      const entities: IMemoryDBEntity[] = [{ id: "1" }, { id: "2" }];
      db.getTable(tableName).push(...entities);

      // Act
      db.printTable(tableName);

      // Assert
      expect(process.stdout.write).toHaveBeenCalledWith(
        `\nRecords in table '${tableName}':\n`,
      );
      expect(console.table).toHaveBeenCalledWith(entities);
    });
  });

  describe("Edge Cases", () => {
    it("should notify if the table is empty", () => {
      // Arrange
      const tableName = "emptyTable";

      // Act
      db.printTable(tableName);

      // Assert
      expect(process.stdout.write).toHaveBeenCalledWith(
        `Table '${tableName}' is empty.`,
      );
    });

    it("should notify if the table does not exist", () => {
      // Arrange
      const tableName = "nonExistentTable";

      // Act
      db.printTable(tableName);

      // Assert
      expect(process.stdout.write).toHaveBeenCalledWith(
        `Table '${tableName}' is empty.`,
      );
    });

    it("should notify if there are no tables in the database", () => {
      // Arrange
      db = new InMemoryDB(); // Ensure no tables exist

      // Act
      db.printTable("anyTable");

      // Assert
      expect(process.stdout.write).toHaveBeenCalledWith("No tables exist.");
    });
  });
});

// End of unit tests for: printTable
