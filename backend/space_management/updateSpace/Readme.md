# 🔄 Update Space Microservice

This microservice is part of the **Space Management** domain and is responsible for updating existing space records in the platform. It is developed in **Go**, using the **Gin** web framework and **GORM** for database interactions.

## 📌 Purpose

The purpose of this service is to allow administrators or authorized systems to modify details of existing spaces such as name, type, location, capacity, and description using the space's unique ID.

## ⚙️ Features

- Updates an existing space by ID.
- Validates input and ensures the space exists.
- Returns structured JSON with the updated data or error details.
- Connects to a MySQL database (or SQLite in test mode).
- Includes Swagger UI for testing and documentation.

## 🛠️ Technologies Used

- **Go (Golang)**
- **Gin** – Web framework for API routing
- **GORM** – ORM for MySQL/SQLite
- **MySQL** – Production database (AWS RDS)
- **SQLite** – Used in test mode
- **Swaggo** – Swagger documentation generator
- **Docker**
- **dotenv**

## 📂 Folder Structure

- `main.go`: Application entry point
- `routes/`: HTTP routes (API definitions)
- `controller/`: Business logic for space updates
- `model/`: Data model for Space
- `config/`: DB initialization and environment loading
- `docs/`: Auto-generated Swagger files
- `tests/`: Placeholder for test coverage
- `.env`: Environment configuration file
- `Dockerfile`: Container configuration
- `go.mod / go.sum`: Module and dependency management

## 🔗 Endpoint

- **PUT** `/api/spaces/:id` – Updates a space with the provided JSON payload.

## 🔐 Environment Variables Required

- `PORT`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`

## 🚀 How to Run This Microservice

### ▶️ Local Execution

```bash
go mod tidy
go run main.go
