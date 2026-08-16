import pool from "./db.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  try {
    const adminPassword = await bcrypt.hash("Admin123", 10);
    const userPassword = await bcrypt.hash("User123", 10);
    const readOnlyPassword = await bcrypt.hash("Readonly123", 10);

    await pool.query(`
      TRUNCATE TABLE transactions, categories, users
      RESTART IDENTITY CASCADE
    `);

    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES
       ($1, $2, $3, 'admin'),
       ($4, $5, $6, 'user'),
       ($7, $8, $9, 'read-only')`,
      [
        "Admin User",
        "admin@finance.com",
        adminPassword,
        "Normal User",
        "user@finance.com",
        userPassword,
        "Read Only User",
        "readonly@finance.com",
        readOnlyPassword,
      ]
    );

    await pool.query(`
      INSERT INTO categories (name)
      VALUES
        ('Salary'),
        ('Food'),
        ('Transport'),
        ('Shopping'),
        ('Bills'),
        ('Entertainment'),
        ('Healthcare'),
        ('Freelance')
    `);

    await pool.query(`
      INSERT INTO transactions
        (user_id, category_id, type, amount, description, transaction_date)
      VALUES
        (1, 1, 'income', 65000, 'Monthly salary', '2026-01-01'),
        (1, 2, 'expense', 4500, 'Groceries and food', '2026-01-05'),
        (1, 3, 'expense', 1800, 'Transport', '2026-01-08'),
        (1, 4, 'expense', 6200, 'Shopping', '2026-01-15'),
        (1, 5, 'expense', 3500, 'Electricity and bills', '2026-01-20'),
        (1, 8, 'income', 12000, 'Freelance project', '2026-01-25'),

        (1, 1, 'income', 65000, 'Monthly salary', '2026-02-01'),
        (1, 2, 'expense', 5200, 'Food and groceries', '2026-02-06'),
        (1, 3, 'expense', 2100, 'Transport', '2026-02-10'),
        (1, 6, 'expense', 2800, 'Movies and entertainment', '2026-02-14'),
        (1, 5, 'expense', 3200, 'Monthly bills', '2026-02-20'),
        (1, 8, 'income', 8000, 'Freelance work', '2026-02-26'),

        (1, 1, 'income', 65000, 'Monthly salary', '2026-03-01'),
        (1, 2, 'expense', 4800, 'Food and groceries', '2026-03-05'),
        (1, 3, 'expense', 1900, 'Transport', '2026-03-09'),
        (1, 4, 'expense', 7500, 'Shopping', '2026-03-16'),
        (1, 7, 'expense', 2500, 'Healthcare', '2026-03-21'),
        (1, 8, 'income', 15000, 'Freelance project', '2026-03-27'),

        (1, 1, 'income', 65000, 'Monthly salary', '2026-04-01'),
        (1, 2, 'expense', 5100, 'Food and groceries', '2026-04-06'),
        (1, 5, 'expense', 3600, 'Monthly bills', '2026-04-12'),
        (1, 6, 'expense', 2200, 'Entertainment', '2026-04-18'),
        (1, 3, 'expense', 1700, 'Transport', '2026-04-23'),
        (1, 8, 'income', 10000, 'Freelance work', '2026-04-28'),

        (2, 1, 'income', 50000, 'Monthly salary', '2026-05-01'),
        (2, 2, 'expense', 4000, 'Food', '2026-05-05'),
        (2, 3, 'expense', 1500, 'Transport', '2026-05-10'),
        (2, 5, 'expense', 3000, 'Bills', '2026-05-15'),

        (2, 1, 'income', 50000, 'Monthly salary', '2026-06-01'),
        (2, 4, 'expense', 5500, 'Shopping', '2026-06-08'),
        (2, 6, 'expense', 2000, 'Entertainment', '2026-06-16'),
        (2, 2, 'expense', 4200, 'Food', '2026-06-22')
    `);

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await pool.end();
  }
};

seed();