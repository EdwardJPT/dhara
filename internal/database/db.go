package database

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

// DBTX is an interface that both *sql.DB and *sql.Tx satisfy.
// This allows us to use the same database functions in or out of a transaction.
type DBTX interface {
	Exec(query string, args ...any) (sql.Result, error)
	QueryRow(query string, args ...any) *sql.Row
	Query(query string, args ...any) (*sql.Rows, error)
}

func InitSQLite() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./sqlite_files/tasks.db?_foreign_keys=yes&_journal_mode=WAL")
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	// Set foreign_keys = ON with query too for safety
	sqlStmt := `PRAGMA foreign_keys = ON;`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func CheckFK(db *sql.DB) int {
	var fkEnabled int
	db.QueryRow("PRAGMA foreign_keys;").Scan(&fkEnabled)
	return fkEnabled
}

func CheckJournalMode(db *sql.DB) string {
	var journalMode string
	db.QueryRow("PRAGMA journal_mode;").Scan(&journalMode)
	return journalMode
}

func CheckCacheSize(db *sql.DB) int {
	var cacheSize int
	db.QueryRow("PRAGMA cache_size;").Scan(&cacheSize)
	return cacheSize
}
