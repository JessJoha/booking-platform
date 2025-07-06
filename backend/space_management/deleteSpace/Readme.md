# ❌ Delete Space Microservice

This microservice is part of the **Space Management** domain and is responsible for deleting existing spaces by their unique ID from the platform. It is built in **Go**, using the **Gin** framework and **GORM** for database operations.

## 📌 Purpose

The main objective of this service is to provide a secure and simple way to remove a space (e.g., sports field, court, room) from the system when it is no longer available or relevant.

## ⚙️ Features

- Deletes a space from the database by its ID.
- Validates ID and returns appropriate HTTP responses.
- Connects to a MySQL database (or SQLite in testing mode).
- Includes Swagger documentation for easy API testing.
- Organized with routes, controllers, models, and configs.

## 🛠️ Technologies Used

- **Go (Golang)**
- **Gin** – Lightweight web framework
- **GORM** – ORM for database operations
- **MySQL** – Primary data source (RDS)
- **SQLite** – In-memory DB for test mode
- **Swaggo** – Swagger for Go
- **Docker**
- **dotenv** – Loads environment config

## 📂 Folder Structure

- `main.go`: Service entry point
- `routes/`: Route definitions
- `controller/`: Delete logic and DB interaction
- `model/`: Space entity model
- `config/`: Environment and DB connection
- `docs/`: Swagger documentation
- `tests/`: Future test cases
- `.env`: Environment configuration
- `Dockerfile`: Docker image builder
- `go.mod / go.sum`: Go module dependencies

## 🔗 Endpoint

- **DELETE** `/api/spaces/:id` – Deletes a space by ID

## 🔐 Environment Variables Required

- `PORT`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`

## 🚀 How to Run This Microservice

### ▶️ Local Execution

```bash
go mod tidy
go run main.go
