# ♻️ Update Reservation Microservice

The `updateReservation` microservice enables users to modify existing reservation details and ensures accurate occupancy data by notifying other services of updates.  
This microservice runs on **port 3003** and uses **Node.js**, **Express**, and **PostgreSQL** with **Sequelize ORM**.

---

## 📌 Purpose

- Update an existing reservation by ID.
- Secure endpoints with JWT-based authentication.
- Notify the occupancy microservice when a reservation changes (webhook events).
- Expose interactive Swagger documentation.

---

## 🔧 Technologies

- **Node.js** (Runtime)
- **Express** (Web framework)
- **Sequelize** (ORM for PostgreSQL)
- **PostgreSQL** (Database)
- **JWT** (Authentication)
- **Axios** (Webhook client)
- **Swagger** (API documentation)

---

## 🧩 Architecture & Communication

- **Consumes**: HTTP PUT requests from frontend or external systems.
- **Connects to**: PostgreSQL database hosted on AWS RDS.
- **Sends Webhook Events** to:  
  `http://localhost:6000/webhook/occupancy` (occupancyReports service)

---

## 📁 Folder Structure

updateReservation/
├── src/
│ ├── config/ # Sequelize database configuration
│ ├── controller/ # Logic for updating reservations
│ ├── middleware/ # JWT authentication middleware
│ ├── model/ # Sequelize Booking model
│ ├── routes/ # Express routes with Swagger docs
│ └── webhook/ # Axios client to notify occupancyReports
├── tests/ # Jest unit tests
├── .env # Environment variables
├── Dockerfile # Docker image setup
├── package.json # Project dependencies
├── package-lock.json # Lock file
└── server.js # Entry point

### 🔨 How to Compile and Run
1. **Clone the repository and enter the project folder:**
```bash
git clone https://github.com/JessJoha/booking-platform.git
cd backend/reservation_management/updateReservation
npm install
node server.js