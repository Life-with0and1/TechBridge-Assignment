import pool from "../db/db.js";
import redisClient from "../config/redis.js";

export const getCategories = async (req, res) => {
  try {
    const cachedCategories = await redisClient.get("categories");
    if (cachedCategories) {
      return res.json({success: true, categories: JSON.parse(cachedCategories)});
    }

    const result = await pool.query(
      `SELECT id, name
       FROM categories
       ORDER BY name ASC`
    );
    await redisClient.setEx("categories",60 * 60,JSON.stringify(result.rows));

    return res.json({success: true,categories: result.rows});
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({success: false,message: "Internal server error"});
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({success: false,message: "Category name is required"});
    }

    const result = await pool.query(
      `INSERT INTO categories (name)
       VALUES ($1)
       RETURNING id, name`,
      [name.trim()]
    );
    await redisClient.del("categories");

    return res.status(201).json({success: true,message: "Category created successfully",category: result.rows[0],});
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};