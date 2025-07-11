# 🧑‍💼 Find User Microservice

This microservice is part of the **User Management** domain and is responsible for retrieving user information based on a given user ID or username. It is designed to provide read-only access to user data for use in authentication flows, profile views, and session validation.

## 📌 Purpose

The main goal of this service is to allow internal systems to securely look up user information from the database without exposing or modifying any data.

## ⚙️ Features

- Search for a user by user ID or username.
- JWT-based request validation.
- Connection to a MySQL database (typically hosted in AWS RDS).
- Auto-generated Swagger documentation at `/apidocs`.
- Health check available at the root endpoint.

## 🛠️ Technologies

- Python 3
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- Flasgger (Swagger UI)
- MySQL
- Docker
- python-dotenv

## 📂 Folder Structure

- `app.py`: Application entry point.
- `config.py`: Loads environment variables.
- `routes/`: Route definitions to search users.
- `model/`: SQLAlchemy user model.
- `extensions.py`: App extensions initialization.
- `.env`: Environment variables.
- `Dockerfile`: Container configuration.
- `requirements.txt`: Python dependencies.
- `tests/`: Unit/integration test files.

## 🔗 Connectivity

This service connects to a MySQL database and interacts with other microservices in the User domain, including registration, authentication, and profile services.

## 🚀 Deployment

The service can be executed locally with Python or inside a Docker container. It listens on the port defined in the environment file (`FIND_USER_SERVICE_PORT`).

## 🔐 Environment Variables Required

- SECRET_KEY
- JWT_SECRET
- DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
- DB_URL
- FIND_USER_SERVICE_PORT
- ACCESS_TOKEN_EXPIRATION

## 🧾 Summary

The `findUser` microservice ensures secure and efficient access to user data, serving as a core utility within distributed authentication and profile systems.
