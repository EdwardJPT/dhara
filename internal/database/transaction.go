package database

import "database/sql"

type Transaction struct {
	db *sql.DB
}

func InitTransactionObject(db *sql.DB) *Transaction {
	return &Transaction{db: db}
}

func (o *Transaction) Start() (*sql.Tx, error) {
	return o.db.Begin()
}
