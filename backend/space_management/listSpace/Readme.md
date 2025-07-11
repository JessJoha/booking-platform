# 📋 List Space Microservice

This microservice is part of the **Space Management** domain and is responsible for retrieving and displaying a list of all registered spaces. It provides a simple GET endpoint that returns all available spaces stored in the database.

## 📌 Purpose

The goal of this service is to make all spaces visible to other services or users, enabling them to browse options and make informed decisions for reservations or management.

## ⚙️ Features

- Lists all spaces stored in the system.
- Returns structured JSON with fields like name, location, type, and capacity.
- Connects to a MySQL database (or SQLite in testing mode).
- Auto-generated Swagger documentation.
- Lightweight, clean architecture using Go and Gin.

## 🛠️ Technologies Used

- **Go (Golang)**
- **Gin** – HTTP web framework
- **GORM** – ORM for DB operations
- **MySQL** – Primary database
- **SQLite** – For test mode
- **Swaggo** – Swagger documentation
- **Docker**
- **dotenv**

## 📂 Folder Structure

- `main.go`: Main application entry point
- `routes/`: Route handler for listing spaces
- `controller/`: Logic to fetch data from the database
- `model/`: GORM struct for `Space`
- `config/`: DB initialization and environment loader
- `docs/`: Swagger auto-generated files
- `tests/`: Test directory
- `.env`: Environment config
- `Dockerfile`: Container build instructions
- `go.mod / go.sum`: Go module dependencies

## 🔗 Endpoint

- **GET** `/api/spaces` – Returns a list of all available spaces.

## 🔐 Environment Variables Required

- `PORT`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`

## 🚀 How to Run This Microservice

### ▶️ Local Execution

```bash
go mod tidy
go run main.go
