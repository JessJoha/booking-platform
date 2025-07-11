# 📋 List Reservation Microservice

The `listReservation` microservice allows authorized users to retrieve all existing reservations from the database using a secure and efficient RESTful API.  
This microservice runs on **port 3004** and is built with **Node.js**, **Express**, and **PostgreSQL** using **Sequelize ORM**.

---

## 📌 Purpose

- List all reservations from the system.
- Secure access using JWT authentication.
- Provide clear and interactive API documentation with Swagger.

---

## 🔧 Technologies

- **Node.js** (Runtime)
- **Express** (Web framework)
- **Sequelize** (ORM for PostgreSQL)
- **PostgreSQL** (Database)
- **Swagger** (API documentation)
- **JWT** (Authentication)

---

## 🧩 Architecture & Communication

- **Consumes**: RESTful API requests from frontend or external systems.
- **Connects to**: PostgreSQL database hosted on AWS RDS.
- **Does not emit events or webhooks** — it is a pure RESTful query microservice.

---

## 📁 Folder Structure

listReservation/
├── src/
│ ├── config/ # Sequelize database configuration
│ ├── controller/ # Logic for listing reservations
│ ├── middleware/ # JWT token verification
│ ├── model/ # Booking model
│ └── routes/ # API routes with Swagger docs
├── tests/ # Jest unit tests
├── .env # Environment variables
├── Dockerfile # Docker image setup
├── package.json # Project dependencies
├── package-lock.json # Lock file
└── server.js # Application entry point

### 🔨 How to Compile and Run
1. **Clone the repository and enter the project folder:**
```bash
git clone https://github.com/JessJoha/booking-platform.git
cd backend/reservation_management/listReservation
npm install
node server.js