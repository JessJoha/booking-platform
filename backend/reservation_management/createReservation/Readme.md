# 🗓️ createReservation Microservice

The `createReservation` microservice belongs to the **Reservation Management** domain.  
It allows authenticated users to create new reservations for available sports spaces.

This microservice communicates with:
- 🛢️ **PostgreSQL** for data persistence.
- 🔁 **occupancyReports** microservice via Webhook for event propagation.

It runs by default on **port 3001**.

---

## 🚀 Overview

- Receives reservation data via a POST request.
- Validates input and user token (JWT).
- Persists reservation in PostgreSQL.
- Sends reservation data to the occupancy tracking service.
- Exposes API documentation through Swagger.
- Containerized using Docker.

---

## 🛠️ Tech Stack

- **Node.js + Express** – Web framework
- **PostgreSQL** – Relational database
- **Sequelize** – ORM
- **JWT** – Authentication
- **Swagger** – API documentation
- **Jest** – Unit testing
- **Docker** – Containerization

---

## 📁 Folder Structure

├── src/
│ ├── config/ # Sequelize configuration
│ ├── controller/ # Reservation creation logic
│ ├── middleware/ # JWT validation
│ ├── model/ # Booking model
│ ├── routes/ # API routes
│ └── webhook/ # Webhook event dispatcher
├── tests/ # Unit tests (Jest)
├── .env # Environment variables
├── Dockerfile # Docker image setup
├── server.js # Entry point
