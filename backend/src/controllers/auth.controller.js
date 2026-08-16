import pool from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({success: false,message: "All the details are required.",});
    }

    if (password.length < 6) {
      return res.status(400).json({success: false,message: "Password must be at least 6 characters",});
    }

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1",[email]);

    if (existingUser.rows.length > 0) {
    return res.status(409).json({success: false,message: "Email is already registered"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role, created_at`,
        [name, email, hashedPassword]
        );

    const user = result.rows[0];

    return res.status(201).json({success: true,message: "User registered successfully",user});
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({success: false,message: "Email and password are required",});
    }

    const result = await pool.query(
      `SELECT id, name, email, password, role
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({success: false,message: "Invalid credentials",});
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if (!isPasswordValid) {
      return res.status(401).json({success: false,message: "Invalid credentials",});
    }

    const token = jwt.sign({id: user.id,role: user.role},process.env.JWT_SECRET,{expiresIn: "1h"});

    return res.json({success: true,message: "Login successful",token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
