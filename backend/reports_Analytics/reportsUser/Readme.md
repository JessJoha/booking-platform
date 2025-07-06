
# 📊 User Reports Microservice

The `reportsUser` microservice allows retrieval of reservation data for users, based on either **user ID** or **username**.  
It communicates with other microservices to enhance data reporting, and runs on **port 3009** using **Node.js**, **Express**, and **PostgreSQL** with **Sequelize ORM**.

---

## 📌 Purpose

- Retrieve all reservations for a given user ID.
- Retrieve all reservations by username (uses userProfileService for lookup).
- Provide Swagger documentation.
- Secure architecture, extensible to analytics and reporting.

---

## 🔧 Technologies

- **Node.js** (Runtime)
- **Express** (Web framework)
- **Sequelize** (ORM for PostgreSQL)
- **PostgreSQL** (Database)
- **Swagger** (API documentation)
- **Axios** (Microservice HTTP client)

---

## 🧩 Architecture & Communication

- **Consumes**: HTTP GET requests for user reservation history.
- **Connects to**: PostgreSQL database hosted on AWS RDS.
- **Calls**: External profile microservice via `http://localhost:5007/user/{username}`.

---

## 📁 Folder Structure

reportsUser/
├── src/
│   ├── controller/      # Logic to fetch reservations by userId or username
│   ├── model/           # Sequelize model for Bookings
│   ├── routes/          # Express routes + Swagger documentation
├── tests/               # Jest tests (optional)
├── .env                 # Environment variables
├── Dockerfile           # Docker image setup
├── package.json         # Project dependencies
├── package-lock.json    # Lock file
├── server.js            # Entry point

---

## 🔐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reports/user/:userId` | GET | Returns all reservations for a specific user ID |
| `/api/reports/username/:username` | GET | Resolves username to ID and returns reservations |


## 🔨 How to Compile and Run

1. **Clone the repository and enter the folder:**

```bash
git clone https://github.com/JessJoha/booking-platform.git
cd backend/reportsAnalytics/reportsUser
npm install
node server.js
```