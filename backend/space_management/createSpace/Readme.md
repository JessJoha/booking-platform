# 🏟️ Create Space Microservice

This microservice is part of the **Space Management** domain. It is responsible for creating new sports or recreational spaces by registering them in a relational database. This service is built with **Go** and uses **Gin** as the web framework and **GORM** as the ORM.

## 📌 Purpose

The main function of this microservice is to allow authorized systems or admins to register new spaces into the platform. Each space includes attributes such as name, type, capacity, and location details.

## ⚙️ Features

- Creates new space records via a POST request.
- Validates and persists data into a MySQL database.
- Uses Swagger UI for automatic API documentation.
- Provides clear structure with routes, controllers, models, and config.
- Supports testing mode using SQLite in-memory.

## 🛠️ Technologies Used

- **Go (Golang)**
- **Gin** – HTTP web framework
- **GORM** – ORM for Go
- **MySQL** – Database engine (AWS RDS)
- **SQLite** – Used for testing
- **Swaggo** – Swagger documentation for Go
- **Docker** – Containerization
- **dotenv** – Environment variable management

## 📂 Folder Structure

- `main.go`: Entry point of the service.
- `routes/`: Route definitions for API endpoints.
- `controller/`: Contains business logic for creating a space.
- `model/`: Defines the `Space` data model.
- `config/`: Database connection and environment loading.
- `docs/`: Swagger auto-generated documentation.
- `tests/`: For test cases (e.g., integration tests).
- `.env`: Contains environment variables.
- `Dockerfile`: Builds the container image.
- `go.mod / go.sum`: Go module definitions.

## 🔗 Endpoint

- **POST** `/api/spaces` – Creates a new space with the required JSON payload.

## 🔐 Environment Variables Required

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

## 🚀 How to Run This Microservice

### 🔧 Prerequisites

- Go installed (`go 1.20+`)
- MySQL database instance (or Docker)
- `.env` file configured with correct values

### ▶️ Run Locally

```bash
go mod tidy
go run main.go
