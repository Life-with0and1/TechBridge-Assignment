import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Finance Tracker API",
      version: "1.0.0",
      description:
        "API documentation for the Finance Tracker application",
    },

    servers: [
      {
        url: "https://finance-tracker-backend-rece.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
        },

        Category: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Food",
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Transaction: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            user_id: {
              type: "integer",
              example: 1,
            },
            category_id: {
              type: "integer",
              example: 2,
            },
            type: {
              type: "string",
              enum: ["income", "expense"],
              example: "expense",
            },
            amount: {
              type: "number",
              format: "double",
              example: 1500.5,
            },
            description: {
              type: "string",
              example: "Monthly grocery shopping",
            },
            transaction_date: {
              type: "string",
              format: "date",
              example: "2026-08-16",
            },
          },
        },

        TransactionRequest: {
          type: "object",
          required: [
            "category_id",
            "type",
            "amount",
            "transaction_date",
          ],
          properties: {
            category_id: {
              type: "integer",
              example: 2,
            },
            type: {
              type: "string",
              enum: ["income", "expense"],
              example: "expense",
            },
            amount: {
              type: "number",
              format: "double",
              example: 1500.5,
            },
            description: {
              type: "string",
              example: "Monthly grocery shopping",
            },
            transaction_date: {
              type: "string",
              format: "date",
              example: "2026-08-16",
            },
          },
        },
      },
    },

    tags: [
      {
        name: "Authentication",
        description: "User registration and login",
      },
      {
        name: "Categories",
        description: "Transaction category management",
      },
      {
        name: "Transactions",
        description: "Income and expense transaction management",
      },
      {
        name: "Dashboard",
        description: "Financial summaries and analytics",
      },
    ],

    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RegisterRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully",
            },
            400: {
              description: "Invalid registration data",
            },
            409: {
              description: "Email already exists",
            },
            429: {
              description: "Too many authentication requests",
            },
          },
        },
      },

      "/api/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginRequest",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
            },
            401: {
              description: "Invalid credentials",
            },
            429: {
              description: "Too many authentication requests",
            },
          },
        },
      },

      "/api/categories": {
        get: {
          tags: ["Categories"],
          summary: "Get all categories",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Categories retrieved successfully",
            },
            401: {
              description: "Authentication required",
            },
          },
        },

        post: {
          tags: ["Categories"],
          summary: "Create a category",
          description: "Admin users only.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Entertainment",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Category created successfully",
            },
            401: {
              description: "Authentication required",
            },
            403: {
              description: "Admin access required",
            },
          },
        },
      },

      "/api/transactions": {
        get: {
          tags: ["Transactions"],
          summary: "Get transactions",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Transactions retrieved successfully",
            },
            401: {
              description: "Authentication required",
            },
            403: {
              description: "Access denied",
            },
            429: {
              description: "Too many transaction requests",
            },
          },
        },

        post: {
          tags: ["Transactions"],
          summary: "Create a transaction",
          description: "Admin and regular users can create transactions.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TransactionRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Transaction created successfully",
            },
            400: {
              description: "Invalid transaction data",
            },
            401: {
              description: "Authentication required",
            },
            403: {
              description: "Access denied",
            },
            429: {
              description: "Too many transaction requests",
            },
          },
        },
      },

      "/api/transactions/{id}": {
        get: {
          tags: ["Transactions"],
          summary: "Get a transaction by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer",
              },
              example: 1,
            },
          ],
          responses: {
            200: {
              description: "Transaction retrieved successfully",
            },
            404: {
              description: "Transaction not found",
            },
          },
        },

        put: {
          tags: ["Transactions"],
          summary: "Update a transaction",
          description: "Admin and regular users can update transactions.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer",
              },
              example: 1,
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TransactionRequest",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Transaction updated successfully",
            },
            404: {
              description: "Transaction not found",
            },
          },
        },

        delete: {
          tags: ["Transactions"],
          summary: "Delete a transaction",
          description: "Admin and regular users can delete transactions.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer",
              },
              example: 1,
            },
          ],
          responses: {
            200: {
              description: "Transaction deleted successfully",
            },
            404: {
              description: "Transaction not found",
            },
          },
        },
      },

      "/api/dashboard/summary": {
        get: {
          tags: ["Dashboard"],
          summary: "Get financial summary",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Financial summary retrieved successfully",
            },
            401: {
              description: "Authentication required",
            },
            403: {
              description: "Access denied",
            },
            429: {
              description: "Too many analytics requests",
            },
          },
        },
      },

      "/api/dashboard/monthly": {
        get: {
          tags: ["Dashboard"],
          summary: "Get monthly financial summary",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Monthly summary retrieved successfully",
            },
          },
        },
      },

      "/api/dashboard/yearly": {
        get: {
          tags: ["Dashboard"],
          summary: "Get yearly financial summary",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Yearly summary retrieved successfully",
            },
          },
        },
      },

      "/api/dashboard/categories": {
        get: {
          tags: ["Dashboard"],
          summary: "Get category-based financial summary",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Category summary retrieved successfully",
            },
          },
        },
      },
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;