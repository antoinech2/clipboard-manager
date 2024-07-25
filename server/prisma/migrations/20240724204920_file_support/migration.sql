-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "date_created" DATETIME NOT NULL,
    "date_modified" DATETIME,
    "file" BLOB
);
INSERT INTO "new_Note" ("content", "date_created", "date_modified", "id", "title") SELECT "content", "date_created", "date_modified", "id", "title" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
