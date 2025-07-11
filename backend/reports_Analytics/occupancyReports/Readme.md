# 📊 Occupancy Reports Microservice

The `occupancyReports` microservice monitors and reports the number of active reservations for each space on a given date.  
This service runs on **port 6000** and is developed using **Go**, **MongoDB**, and **Webhook-driven communication**.

---

## 📌 Purpose

- Receive real-time **webhook events** when reservations are created, updated, or deleted.
- Keep a **daily count of reservations** per space.
- Provide a **GET endpoint** to list current occupancy data.
- Delete occupancy documents when reservation count drops to zero.
- Serve Swagger API documentation.

---

## 🔧 Technologies

- **Go** (Backend language)
- **MongoDB** (Database)
- **Gorilla Mux** (Routing)
- **Swagger + swaggo** (API documentation)
- **Docker** (Containerization)
- **Webhook** (Event-driven communication)

---

## 🧩 Architecture & Communication

- **Consumes Webhooks from**: Reservation microservices (`create`, `update`, `delete`).
- **Stores Data in**: MongoDB (`analyticsdb`, collection `occupancy`).
- **Exposes endpoints**:
  - `POST /webhook/occupancy` – Receives reservation events
  - `GET /report` – Returns current occupancy data
- **Swagger docs** available at `/swagger/index.html`.

---

## 📁 Folder Structure

```plaintext
occupancyReports/
├── docs/                # Swagger documentation files
├── src/
│   ├── config/          # MongoDB connection logic
│   ├── handlers/        # HTTP handlers for routes
│   └── model/           # Data model structs
├── tests/               # Unit tests
├── .env                 # Environment variables
├── Dockerfile           # Docker configuration
├── go.mod               # Go dependencies
├── go.sum               # Go lock file
└── main.go              # Application entry point
```
---

## 🚀 How to Compile and Run

1. **Clone the repository and navigate to the project folder:**

```bash
git clone https://github.com/JessJoha/booking-platform.git
cd backend/reports_Analytics/occupancyReports
```

2. **Install dependencies and build the service:**

```bash
go mod tidy
go build -o occupancyReports main.go
```

3. **Run the service:**
```bash
go run main.go
```