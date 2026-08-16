import pool from "../db/db.js";
import redisClient from "../config/redis.js";

export const getSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const cacheKey = `dashboard:summary:${req.user.id}:${from || "all"}:${to || "all"}`;

    const cachedSummary = await redisClient.get(cacheKey);

    if (cachedSummary) {
    return res.json({
        success: true,
        summary: JSON.parse(cachedSummary),
    });
    }

    if (from && Number.isNaN(Date.parse(from))) {
        return res.status(400).json({
            success: false,
            message: "Invalid from date",
        });
        }

    if (to && Number.isNaN(Date.parse(to))) {
        return res.status(400).json({
            success: false,
            message: "Invalid to date",
        });
        }

    if (from && to && new Date(from) > new Date(to)) {
        return res.status(400).json({
            success: false,
            message: "From date cannot be after to date",
        });
        }

    const result = await pool.query(
      `SELECT
         COUNT(*) AS transaction_count,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
       FROM transactions
       WHERE user_id = $1
        AND ($2::date IS NULL OR transaction_date >= $2::date)
        AND ($3::date IS NULL OR transaction_date <= $3::date)`,
      [req.user.id, from || null, to || null,]
    );

    const totalIncome = Number(result.rows[0].total_income);
    const totalExpense = Number(result.rows[0].total_expense);
    const summary = {
    transaction_count: Number(result.rows[0].transaction_count),
    total_income: result.rows[0].total_income,
    total_expense: result.rows[0].total_expense,
    balance:
        Number(result.rows[0].total_income) -
        Number(result.rows[0].total_expense),
    };

    await redisClient.setEx( cacheKey, 15 * 60, JSON.stringify(summary) );
    return res.json({
      success: true,
      summary });
  } catch (error) {
    console.error("Get summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (from && Number.isNaN(Date.parse(from))) {
    return res.status(400).json({
        success: false,
        message: "Invalid from date",
    });
    }

    if (to && Number.isNaN(Date.parse(to))) {
    return res.status(400).json({
        success: false,
        message: "Invalid to date",
    });
    }

    if (from && to && new Date(from) > new Date(to)) {
    return res.status(400).json({
        success: false,
        message: "From date cannot be after to date",
    });
    }
    const result = await pool.query(
      `SELECT
        TO_CHAR(DATE_TRUNC('month', transaction_date), 'YYYY-MM') AS month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),0) AS total_expense
       FROM transactions
       WHERE user_id = $1
        AND ($2::date IS NULL OR transaction_date >= $2::date)
        AND ($3::date IS NULL OR transaction_date <= $3::date)
       GROUP BY DATE_TRUNC('month', transaction_date)
       ORDER BY DATE_TRUNC('month', transaction_date) ASC`,
      [req.user.id,from || null,to || null]
    );

    return res.json({success: true,monthly_summary: result.rows});
  } catch (error) {
    console.error("Monthly summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getYearlySummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (from && Number.isNaN(Date.parse(from))) {
    return res.status(400).json({
        success: false,
        message: "Invalid from date",
    });
    }

    if (to && Number.isNaN(Date.parse(to))) {
    return res.status(400).json({
        success: false,
        message: "Invalid to date",
    });
    }

    if (from && to && new Date(from) > new Date(to)) {
    return res.status(400).json({
        success: false,
        message: "From date cannot be after to date",
    });
    }
    const result = await pool.query(
      `SELECT
        EXTRACT(YEAR FROM transaction_date)::integer AS year,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),0) AS total_expense
       FROM transactions
       WHERE user_id = $1
        AND ($2::date IS NULL OR transaction_date >= $2::date)
        AND ($3::date IS NULL OR transaction_date <= $3::date)
       GROUP BY EXTRACT(YEAR FROM transaction_date)
       ORDER BY EXTRACT(YEAR FROM transaction_date) ASC`,
      [req.user.id,from || null,to || null]
    );

    return res.json({
      success: true,
      yearly_summary: result.rows,
    });
  } catch (error) {
    console.error("Yearly summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCategorySummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (from && Number.isNaN(Date.parse(from))) {
    return res.status(400).json({
        success: false,
        message: "Invalid from date",
    });
    }

    if (to && Number.isNaN(Date.parse(to))) {
    return res.status(400).json({
        success: false,
        message: "Invalid to date",
    });
    }

    if (from && to && new Date(from) > new Date(to)) {
    return res.status(400).json({
        success: false,
        message: "From date cannot be after to date",
    });
    }

    const result = await pool.query(
      `SELECT c.id AS category_id, c.name AS category,
        COALESCE(SUM(t.amount), 0) AS total_expense
       FROM transactions t
       JOIN categories c ON c.id = t.category_id
      WHERE t.user_id = $1
        AND t.type = 'expense'
        AND ($2::date IS NULL OR t.transaction_date >= $2::date)
        AND ($3::date IS NULL OR t.transaction_date <= $3::date)
       GROUP BY c.id, c.name
       ORDER BY total_expense DESC`,
      [req.user.id,from || null,to || null]
    );

    return res.json({
      success: true,
      category_summary: result.rows,
    });
  } catch (error) {
    console.error("Category summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

