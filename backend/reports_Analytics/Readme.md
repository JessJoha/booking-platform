# 📊 Reports & Analytics Domain

The **Reports & Analytics Domain** provides insights and historical data regarding space reservations made by users in the platform. It consists of microservices that either generate reports or maintain analytical records based on system activity.

---

## 🎯 Main Objectives

- Retrieve all reservations made by a user.
- Allow lookup of reservations using user ID or username.
- Record occupancy history after a reservation is created, updated, or deleted.
- Support observability and decision-making via accessible endpoints.

---

## 🧱 Microservices Included

### 1. 🧾 `reportsUser`
- Retrieves all reservations made by a specific user.
- Accepts queries by `userId` or `username` (calls external profile microservice).
- Technologies: **Node.js**, **Express**, **PostgreSQL**, **Sequelize**, **Swagger**.

### 2. 📉 `occupancyReports`
- Listens to **Webhook** events related to reservation changes.
- Records occupancy data in **MongoDB**.
- Technologies: **Go**, **MongoDB**, **Webhook**, **Gin-Gonic**.

---

## 🔄 Communication & Integration

| Microservice        | Consumes                            | Produces / Notifies               |
|---------------------|--------------------------------------|----------------------------------|
| `reportsUser`       | Internal PostgreSQL / Profile MS     | Reservation data via REST        |
| `occupancyReports`  | Webhook Events (Delete/Update/Create)| Stored analytics in MongoDB      |

---

## 📦 Folder Structure

```
reports_Analytics/
├── occupancyReports/   # Stores occupancy logs (Go + MongoDB)
└── reportsUser/        # Retrieves user-based reservation history (Node.js + PostgreSQL)
```

---

## 🚀 Deployment Info

Each microservice runs independently and can be deployed on separate containers:

- `reportsUser` → Port **3009**
- `occupancyReports` → Port **6000**

---

## 🔧 Technologies Summary

- **Node.js / Express / Sequelize / PostgreSQL**
- **Go / Gin / MongoDB / Webhook Listener**
- **Swagger UI** for API docs