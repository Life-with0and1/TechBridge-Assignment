import pool from "../db/db.js";

export const createTransaction = async (req, res) => {
  try {
    const {category_id,type,amount,description,transaction_date} = req.body || {};

    if (!category_id || !type || !amount || !transaction_date) {
      return res.status(400).json({success: false,message:"Category, type, amount and transaction date are required"});
    }
    const categoryResult = await pool.query(
        `SELECT id FROM categories WHERE id = $1`,
        [category_id]
    );

    if (categoryResult.rows.length === 0) {
    return res.status(400).json({
        success: false,
        message: "Invalid category",
    });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({success: false,message: "Type must be income or expense"});
    }

    if (amount <= 0) {
      return res.status(400).json({success: false,message: "Amount must be greater than 0"});
    }

    const result = await pool.query(
      `INSERT INTO transactions
        (user_id, category_id, type, amount, description, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.id,
        category_id,
        type,
        amount,
        description || null,
        transaction_date,
      ]
    );

    return res.status(201).json({success: true,message: "Transaction created successfully",transaction: result.rows[0]});
  } catch (error) {
    console.error("Create transaction error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1),100);

    const offset = (page - 1) * limit;

    const { search, category_id, type } = req.query;
    const searchValue = search ? `%${search}%` : null;
    const categoryId = category_id ? parseInt(category_id) : null;
    const transactionType = type || null;

    const result = await pool.query(
    `SELECT t.id, t.category_id, t.type, t.amount, t.description, t.transaction_date, t.created_date, c.name AS category
    FROM transactions t
    JOIN categories c ON c.id = t.category_id
    WHERE t.user_id = $1
        AND (
            $2::text IS NULL
            OR t.description ILIKE $2
            OR c.name ILIKE $2
        )
        AND (
            $3::integer IS NULL
            OR t.category_id = $3
        )
            AND (
            $4::text IS NULL
            OR t.type = $4
        )
    ORDER BY t.transaction_date DESC, t.created_date DESC
    LIMIT $5 OFFSET $6`,
    [req.user.id, searchValue, categoryId, transactionType, limit, offset]
    );

    return res.json({success: true,page,limit,transactions: result.rows});
  } catch (error) {
    console.error("Get transactions error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT t.id, t.category_id, t.type, t.amount, t.description, t.transaction_date, t.created_date, c.name AS category
       FROM transactions t
       JOIN categories c ON c.id = t.category_id
       WHERE t.id = $1
         AND t.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({success: false,message: "Transaction not found"});
    }

    return res.json({success: true,transaction: result.rows[0]});
  } catch (error) {
    console.error("Get transaction error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const {category_id,type,amount,description,transaction_date} = req.body || {};

    if (!category_id || !type || !amount || !transaction_date) {
      return res.status(400).json({success: false,message:"Category, type, amount and transaction date are required"});
    }
    const categoryResult = await pool.query(
        `SELECT id FROM categories WHERE id = $1`,
        [category_id]
        );

    if (categoryResult.rows.length === 0) {
    return res.status(400).json({
        success: false,
        message: "Invalid category",
    });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({success: false,message: "Type must be income or expense"});
    }

    if (amount <= 0) {
      return res.status(400).json({success: false,message: "Amount must be greater than 0"});
    }

    const result = await pool.query(
      `UPDATE transactions
       SET category_id = $1, type = $2, amount = $3, description = $4, transaction_date = $5
       WHERE id = $6
         AND user_id = $7
       RETURNING *`,
      [category_id, type, amount, description || null, transaction_date, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({success: false,message: "Transaction not found"});
    }

    return res.json({success: true, message: "Transaction updated successfully", transaction: result.rows[0]});
  } catch (error) {
    console.error("Update transaction error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM transactions
       WHERE id = $1
         AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({success: false,message: "Transaction not found"});
    }

    return res.json({success: true,message: "Transaction deleted successfully"});
  } catch (error) {
    console.error("Delete transaction error:", error);

    return res.status(500).json({success: false,message: "Internal server error"});
  }
};