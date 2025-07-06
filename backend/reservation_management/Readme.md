# 🗂️ Reservation Management Domain

The `reservation_management` domain is responsible for handling all reservation-related operations in the **MiniCourt** platform.  
It is composed of four autonomous microservices that allow users to **create**, **list**, **update**, and **delete** reservations in a secure and modular way.

Each microservice is independently deployable, containerized with Docker, and communicates with external services (e.g., **occupancyReports**) using **Webhooks**.

---

## 🧱 Microservices Included

| Microservice          | Description                                    | Port   | Technology Stack          |
|-----------------------|------------------------------------------------|--------|----------------------------|
| `createReservation`   | Creates new reservations                       | 3001   | Node.js, PostgreSQL, JWT   |
| `listReservation`     | Retrieves reservations by user ID or all       | 3004   | Node.js, PostgreSQL, JWT   |
| `updateReservation`   | Updates existing reservations by ID            | 3003   | Node.js, PostgreSQL, JWT   |
| `deleteReservation`   | Deletes reservations and notifies availability | 3002   | Node.js, PostgreSQL, JWT   |

---

## 🛠️ Common Features

- ✅ **Authentication with JWT**
- 🗂️ **Sequelize ORM** to interact with PostgreSQL
- 📘 **Swagger UI** for each service (`/api-docs`)
- 🔗 **Webhook Notifications** to `occupancyReports` service
- 🐳 **Docker Support** for deployment
- 📦 **Modular Folder Structures** per service

---

## 📡 External Communication

Each service that modifies reservation data (`create`, `update`, `delete`) emits a **Webhook** event to inform the `occupancyReports` service about space status changes:

