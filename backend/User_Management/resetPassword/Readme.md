# 🔁 Reset Password Microservice

This microservice is part of the **User Management** domain and is responsible for allowing users to securely reset their passwords using a recovery code sent to their email. It verifies the recovery code stored in Redis and updates the password in the database.

## 📌 Purpose

The main purpose of this service is to allow users who have forgotten their password to reset it safely by validating a temporary code.

## ⚙️ Features

- Resets user password using email, recovery code, and new password.
- Validates recovery code from Redis before updating credentials.
- Connects to a MySQL database to update the password.
- Includes Swagger UI documentation.
- Health check available on the root path.

## 🛠️ Technologies

- Python 3
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- Redis
- MySQL (AWS RDS)
- Flasgger (Swagger)
- bcrypt (password hashing)
- Docker
- python-dotenv

## 📂 Folder Structure

- `app.py`: Initializes the Flask app and services.
- `config.py`: Environment and configuration loader.
- `routes/`: Contains the password reset endpoint logic.
- `model/`: User model with password setter.
- `extensions.py`: Sets up DB and Redis clients.
- `.env`: Configuration variables.
- `Dockerfile`: Docker build instructions.
- `requirements.txt`: Project dependencies.
- `tests/`: Placeholder for future tests.

## 🔗 Connectivity

- Connects to a **MySQL** database for user data.
- Uses **Redis** to store temporary recovery codes.
- Should be triggered after a user requests a password reset code via a separate service.

## 🌐 Endpoint

- POST `/recover/reset`: Resets the password if the email and recovery code match.

## 🔐 Required Environment Variables

- DB_URL, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT
- REDIS_HOST, REDIS_PORT
- RESET_SERVICE_PORT

## 📑 Swagger Docs

API documentation is available at `/apidocs` for testing and visualization.

## 🧾 Summary

The `resetPassword` microservice enables secure and time-bound password recovery using Redis for code verification.  
By default, this service runs on **port 5006**.
