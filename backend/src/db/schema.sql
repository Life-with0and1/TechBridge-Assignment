CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('admin', 'user', 'read-only'))
);

CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    CONSTRAINT transaction_type_check
        CHECK (type IN ('income', 'expense')),

    CONSTRAINT transaction_amount_check
        CHECK (amount > 0)
);

CREATE INDEX idx_transactions_user_id
ON transactions(user_id);

CREATE INDEX idx_transactions_category_id
ON transactions(category_id);

CREATE INDEX idx_transactions_date
ON transactions(transaction_date);

CREATE INDEX idx_transactions_type
ON transactions(type);