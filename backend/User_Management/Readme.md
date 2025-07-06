# 👥 User Management Domain

This domain is composed of a set of microservices responsible for handling all operations related to users in the system. It covers authentication, registration, profile creation and updates, recovery processes, and secure access to user data.

## 🧩 Purpose

The User Management domain centralizes all functionalities that involve user lifecycle operations — from registration and login, to recovery, lookup, and profile personalization.

Each service is modular and designed to work independently but communicates with others via secure API calls.

---

## 📦 Included Microservices

| Microservice         | Description                                                                 | Default Port |
|----------------------|-----------------------------------------------------------------------------|--------------|
| `registerUser`       | Handles new user registrations, validates data, and stores in MySQL.        | 5001         |
| `login_auth`         | Authenticates users, issues JWT tokens, and verifies credentials.           | 5000         |
| `resetPassword`      | Allows users to reset their password with a recovery code.                  | 5006         |
| `sendRecoveryCode`   | Sends a 6-digit code via email for password recovery validation.            | 5005         |
| `userProfile`        | Initializes and retrieves user profiles using data from JWT tokens.         | 5010         |
| `updateProfile`      | Allows authenticated users to update their phone, avatar, or description.   | 5008         |
| `findUser`           | Finds users by ID or username via MySQL queries.                            | 5002         |
| `getUserByUsername`  | Retrieves user details using a direct MongoDB query by username.            | 5007         |

---

## 🛠️ Shared Technologies

- **Python 3**, Flask, Flask-CORS
- **JWT** authentication
- **Swagger (Flasgger)** for documentation
- **MySQL**, **MongoDB**, and **Redis** for data storage
- **Docker** for containerization
- **dotenv** for environment management

---

## 🔐 Security

- All sensitive operations require a valid **JWT token** passed in the `Authorization` header.
- Passwords are securely hashed using **bcrypt**.
- Recovery codes are stored temporarily in **Redis** and expire automatically.

---

## 🔗 Inter-Service Communication

- `login_auth` verifies and sends user profile data to `userProfile` via `/profile/init` after a successful login. If the profile does not exist, it is automatically created.
- `sendRecoveryCode` and `resetPassword` coordinate via Redis to manage secure, time-limited recovery codes.
- All microservices are designed following the **RESTful architecture style**, using HTTP methods and clean resource-based endpoints.
- Services are loosely coupled and independently deployable.

## 📑 Documentation

Each microservice provides its own **Swagger UI** available at `/apidocs` for testing and inspection of available endpoints.

---

## 📁 Folder Structure

User_Management/
├── findUser/
├── getUserByUsername/
├── login_auth/
├── registerUser/
├── resetPassword/
├── sendRecoveryCode/
├── updateProfile/
└── userProfile/