# 🏟️ Space Management Domain

This domain is responsible for managing all operations related to **spaces** within the platform — including creation, listing, updating, and deletion of physical or virtual facilities such as sports fields, courts, or rooms.

Each microservice is built independently using **Go (Golang)** and follows a **RESTful architecture**, allowing for modular deployment and easy maintenance.

---

## 📦 Microservices Included

| Microservice     | Description                                           | Default Port |
|------------------|-------------------------------------------------------|--------------|
| `createSpace`    | Registers a new space in the system.                  | 3008         |
| `listSpace`      | Retrieves a list of all available spaces.             | 3010         |
| `updateSpace`    | Updates information of a space using its ID.          | 3011         |
| `deleteSpace`    | Deletes a space from the system by ID.                | 3012         |

---

## 🛠️ Technologies Used Across Services

- **Go (Golang)**
- **Gin** – Web framework
- **GORM** – ORM for MySQL and SQLite
- **MySQL** – Main production database (hosted on AWS RDS)
- **SQLite** – Used in testing mode
- **Swaggo** – Swagger docs for Go
- **Docker**
- **dotenv** – Environment variable loading

---

## 🔗 Architecture & Design

- All microservices are **RESTful**.
- Each service runs independently and connects to a shared **MySQL database**.
- Swagger UI is enabled for each service at `/swagger/index.html`.
- JWT secret is loaded from `.env`, allowing secure access if extended with auth middleware in the future.

---

## 📁 Folder Structure

- space_management/
- ├── createSpace/
- ├── deleteSpace/
- ├── listSpace/
- └── updateSpace/