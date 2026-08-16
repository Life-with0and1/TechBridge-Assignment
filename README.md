# TechBridge Finance Tracker

A full-stack **Finance Tracker** application for managing income, expenses, categories, and financial analytics with role-based access control, JWT authentication, API rate limiting, Redis caching, PostgreSQL, and Swagger/OpenAPI documentation.

## Live Application

### Backend API

https://finance-tracker-backend-rece.onrender.com

### Swagger API Documentation

https://finance-tracker-backend-rece.onrender.com/api-docs

### Frontend

https://techbridge-assignment.onrender.com

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing using `bcryptjs`
* Protected API routes
* Authentication rate limiting

### Role-Based Access Control

The application supports three roles:

| Role          | Permissions                                   |
| ------------- | --------------------------------------------- |
| **Admin**     | Full access, including category creation      |
| **User**      | Create, view, update, and delete transactions |
| **Read-only** | View transactions and dashboard analytics     |

Protected routes use authentication and authorization middleware.

### Transaction Management

Users can:

* Create income transactions
* Create expense transactions
* View transactions
* View an individual transaction
* Update transactions
* Delete transactions
* Associate transactions with categories
* Store transaction dates and descriptions

Supported transaction types:

* `income`
* `expense`

### Categories

* View categories
* Admin-only category creation
* Categories are stored in PostgreSQL
* Categories are associated with transactions

### Dashboard & Analytics

The backend provides:

* Overall financial summary
* Monthly summary
* Yearly summary
* Category-based summary

Dashboard endpoints are protected and available to all authenticated roles.

### Security

The application uses:

* JWT authentication
* Password hashing with bcrypt
* Helmet security middleware
* CORS configuration
* Role-based authorization
* Endpoint-specific rate limiting
* PostgreSQL constraints
* Redis caching

### API Documentation

The backend includes interactive Swagger/OpenAPI documentation.

Swagger UI:

https://finance-tracker-backend-rece.onrender.com/api-docs

The documentation covers:

* Authentication
* Categories
* Transactions
* Dashboard
* JWT Bearer authentication
* Request schemas
* API responses
* Production and local API servers

---

# Technology Stack

## Frontend

* React
* Vite
* JavaScript
* CSS

## Backend

* Node.js
* Express.js
* ES Modules

## Database

* PostgreSQL
* `pg` Node.js driver

## Authentication & Security

* JSON Web Tokens
* bcryptjs
* Helmet
* CORS
* Express Rate Limit

## Caching

* Redis
* Node Redis client

## API Documentation

* Swagger UI Express
* Swagger JSDoc
* OpenAPI 3.0

## Deployment

* Render

---

# Project Structure

```text
techbridge/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   └── transaction.controller.js
│   │   │
│   │   ├── db/
│   │   │   ├── db.js
│   │   │   └── seed.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── rateLimiter.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── transaction.routes.js
│   │   │
│   │   └── swagger.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# Database Schema

The application uses PostgreSQL with the following main tables.

## Users

Stores registered users and their roles.

```text
users
├── id
├── name
├── email
├── password
├── role
└── created_at
```

Supported roles:

```text
admin
user
read-only
```

## Categories

```text
categories
├── id
├── name
└── created_at
```

Category names are unique.

## Transactions

```text
transactions
├── id
├── user_id
├── category_id
├── type
├── amount
├── description
├── transaction_date
└── created_date
```

Transaction types:

```text
income
expense
```

Foreign-key relationships are used between transactions, users, and categories.

Indexes are created for:

* `user_id`
* `category_id`
* `transaction_date`
* `type`

---

# API Endpoints

The API is available under:

```text
/api
```

## Authentication

### Register

```http
POST /api/auth/register
```

Creates a new user.

### Login

```http
POST /api/auth/login
```

Authenticates a user and returns the authentication token.

---

## Categories

### Get Categories

```http
GET /api/categories
```

Requires authentication.

### Create Category

```http
POST /api/categories
```

Requires authentication and the `admin` role.

---

## Transactions

### Create Transaction

```http
POST /api/transactions
```

Available to:

* Admin
* User

### Get Transactions

```http
GET /api/transactions
```

Available to:

* Admin
* User
* Read-only

### Get Transaction

```http
GET /api/transactions/:id
```

Available to:

* Admin
* User
* Read-only

### Update Transaction

```http
PUT /api/transactions/:id
```

Available to:

* Admin
* User

### Delete Transaction

```http
DELETE /api/transactions/:id
```

Available to:

* Admin
* User

---

# Dashboard API

### Overall Summary

```http
GET /api/dashboard/summary
```

### Monthly Summary

```http
GET /api/dashboard/monthly
```

### Yearly Summary

```http
GET /api/dashboard/yearly
```

### Category Summary

```http
GET /api/dashboard/categories
```

All dashboard endpoints require authentication and support:

* Admin
* User
* Read-only

---

# Rate Limiting

Different API areas use different rate limiters.

### Authentication

Registration and login use the authentication rate limiter.

```text
POST /api/auth/register
POST /api/auth/login
```

### Transactions

Transaction operations use the transaction rate limiter.

### Analytics

Dashboard endpoints use the analytics rate limiter.

This helps protect the API against excessive requests and abuse.

---

# Redis Caching

Redis is used to improve performance for frequently requested data and analytics.

The caching layer is intended to reduce repeated database queries and improve response times for dashboard-related operations.

The application can run without a local Redis instance during development if Redis is not configured, but a Redis service should be configured for the deployed environment when caching is required.

---

# Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret

REDIS_URL=your_redis_connection_string
```

Do **not** commit `.env` to GitHub.

The `.gitignore` should contain:

```gitignore
node_modules/
.env
.env.*
!.env.example
dist/
build/
```

---

# Local Development

## 1. Clone the repository

```bash
git clone https://github.com/Life-with0and1/TechBridge-Assignment.git
cd TechBridge-Assignment
```

## 2. Install backend dependencies

```bash
cd backend
npm install
```

## 3. Configure environment variables

Create:

```text
backend/.env
```

and add the required PostgreSQL, JWT, Redis, and port configuration.

## 4. Start the backend

```bash
npm start
```

The backend runs locally at:

```text
http://localhost:5000
```

## 5. Open Swagger

```text
http://localhost:5000/api-docs
```

## 6. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## 7. Start the frontend

```bash
npm run dev
```

---

# Database Seeding

The project includes a seed script:

```bash
cd backend
npm run seed
```

The seed script inserts initial application data into the configured PostgreSQL database.

Make sure the database schema has been created and `DATABASE_URL` points to the correct database before running the seed command.

---

# Authentication Flow

The application uses JWT authentication.

The general flow is:

```text
User
  │
  ▼
Register / Login
  │
  ▼
Backend validates credentials
  │
  ▼
JWT generated
  │
  ▼
Frontend stores authentication state
  │
  ▼
JWT sent with protected requests
  │
  ▼
Authentication middleware
  │
  ▼
Role authorization
  │
  ▼
Controller
  │
  ▼
PostgreSQL / Redis
```

Protected API requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

Swagger can also be used to test protected endpoints by selecting **Authorize** and providing the JWT token.

---

# Deployment

The application is deployed using Render.

The backend is deployed as a Node.js web service.

Production backend:

```text
https://finance-tracker-backend-rece.onrender.com
```

Swagger:

```text
https://finance-tracker-backend-rece.onrender.com/api-docs
```

Frontend:

```text
https://techbridge-assignment.onrender.com
```

Environment variables are configured through the deployment platform rather than committing secrets to the repository.

---

# Testing the API

Swagger provides an interactive way to test the backend.

1. Open the Swagger URL.
2. Register or login using `/api/auth`.
3. Copy the returned JWT token.
4. Click **Authorize**.
5. Enter:

```text
Bearer YOUR_TOKEN
```

6. Select an endpoint.
7. Click **Try it out**.
8. Enter the required request data.
9. Execute the request.
10. Inspect the response.

---

# Demo Roles

The application supports three demonstration roles:

### Admin

Full administrative access, including category management.

### User

Can manage transactions and access dashboard analytics.

### Read-only

Can view transactions and dashboard information but cannot modify transaction data.

> Demo credentials should be added here after confirming the final seeded email addresses and passwords. Do not commit real production credentials or database passwords to this README.

---

# Performance & Caching

Redis caching is included to improve the performance of frequently requested data.

The performance evaluation should compare:

```text
Without cache
    ↓
Database query
    ↓
Response time

With cache
    ↓
Redis lookup
    ↓
Response time
```

Recommended metrics to report:

| Metric                  | Without Cache | With Cache |
| ----------------------- | ------------: | ---------: |
| Average response time   |           TBD |        TBD |
| Cache hit response time |           N/A |        TBD |
| Database queries        |           TBD |        TBD |
| Cache hit rate          |           N/A |        TBD |

These values should be populated using measurements from the deployed application rather than estimated numbers.

---

# Security Measures

The application includes several security mechanisms:

* JWT authentication
* Password hashing
* Role-based authorization
* Helmet security headers
* CORS
* Rate limiting
* PostgreSQL constraints
* Foreign-key relationships
* Environment-based secrets
* Redis caching
* Protected dashboard endpoints

---

# Git Repository

Repository:

https://github.com/Life-with0and1/TechBridge-Assignment

The repository contains separate frontend and backend directories to maintain a clear full-stack project structure.

Commit history documents development progress throughout the implementation.

---

# API Documentation

Interactive OpenAPI documentation is available at:

https://finance-tracker-backend-rece.onrender.com/api-docs

The API documentation provides an interactive interface for exploring and testing the application's endpoints.

---

# Assignment Deliverables

| Deliverable                       | Status                       |
| --------------------------------- | ---------------------------- |
| Organized GitHub repository       | Completed                    |
| Separate frontend/backend folders | Completed                    |
| README documentation              | Completed                    |
| PostgreSQL database               | Completed                    |
| Authentication                    | Completed                    |
| Role-based authorization          | Completed                    |
| Transaction management            | Completed                    |
| Categories                        | Completed                    |
| Dashboard analytics               | Completed                    |
| Swagger/OpenAPI documentation     | Completed                    |
| Local setup instructions          | Completed                    |
| Backend deployment                | Completed                    |
| Frontend deployment               | Completed                    |
| Demo credentials                  | Add final seeded credentials |
| Performance metrics               | Add measured cache results   |

---

# Future Improvements

Possible future improvements include:

* Automated unit and integration tests
* More detailed API response schemas
* Automated performance benchmarking
* Improved cache invalidation strategies
* Pagination for large transaction datasets
* Advanced filtering and searching
* Exporting financial reports
* Additional dashboard visualizations
* CI/CD pipeline
* Automated database migrations

---

# License

This project was developed as part of the TechBridge assignment.
