# 🗑️ Delete Reservation Microservice

The `deleteReservation` microservice handles the deletion of user reservations and notifies other services about freed space availability.  
This microservice runs on **port 3002** and uses **Node.js**, **Express**, and **PostgreSQL** with **Sequelize ORM**.

---

## 📌 Purpose

- Delete a reservation by its ID.
- Retrieve a reservation by its ID.
- Notify other microservices (like occupancyReports) when a reservation is deleted.
- Secure endpoints using JWT authentication.
- Provide Swagger documentation.

---

## 🔧 Technologies

- **Node.js** (Runtime)
- **Express** (Web framework)
- **Sequelize** (ORM for PostgreSQL)
- **PostgreSQL** (Database)
- **Swagger** (API documentation)
- **JWT** (Authentication)
- **Axios** (Webhook HTTP client)

---

## 🧩 Architecture & Communication

- **Consumes**: Requests from frontend or external systems.
- **Connects to**: PostgreSQL database hosted on AWS RDS.
- **Sends Webhook Events** to:  
  `http://localhost:6000/webhook/occupancy` (occupancyReports service)

---

## 📁 Folder Structure

deleteReservation/
├── src/
│ ├── config/ # Sequelize database configuration
│ ├── controller/ # Business logic for deleting and fetching reservations
│ ├── middleware/ # JWT token verification
│ ├── model/ # Sequelize Booking model
│ ├── routes/ # Express routes with Swagger documentation
│ └── webhook/ # Webhook client to notify occupancy service
├── tests/ # Unit tests (Jest)
├── .env # Environment variables
├── Dockerfile # Docker image setup
├── package.json # Project dependencies
├── package-lock.json # Lock file
└── server.js # Entry point

### 🔨 How to Compile and Run
1. **Clone the repository and enter the project folder:**

```bash
git clone https://github.com/JessJoha/booking-platform.git
cd backend/reservation_management/deleteReservation
npm install
node server.js