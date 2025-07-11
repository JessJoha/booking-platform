# 🙋‍♂️ Get User By Username Microservice

This microservice belongs to the **User Management** domain and is responsible for retrieving a user's public information by their exact username. It is useful for profile displays, internal lookups, and validations across distributed services.

## 📌 Purpose

The goal of this microservice is to provide a lightweight and fast endpoint that returns user profile data using the `username` as a search key. It supports exact matches and returns essential information such as email and user ID.

## ⚙️ Features

- Retrieves user data by username.
- Returns a clean JSON response or 404 if not found.
- Integrated with MongoDB (hosted externally).
- Includes Swagger UI for API documentation.
- Health check available on the root endpoint.

## 🛠️ Technologies

- Python 3
- Flask
- Flasgger (Swagger for API docs)
- MongoDB (used via DocumentDB or local instance)
- Docker
- python-dotenv

## 📂 Folder Structure

- `app.py`: Initializes the application and loads configuration.
- `config.py`: Loads and parses environment variables.
- `routes/`: Contains the route for getting users by username.
- `extensions.py`: Manages the MongoDB collection setup.
- `.env`: Environment file with database connection and service port.
- `Dockerfile`: Configuration for containerization.
- `requirements.txt`: Python dependencies.
- `tests/`: Test cases for validation.

## 🔗 Connectivity

This service connects to a MongoDB database named `profilesDB`, using a URI specified in the environment file. It works in coordination with other user profile services within the platform.

## 🚀 Deployment

The service can be deployed using Python or Docker. It listens on the port defined by `PROFILE_SERVICE_PORT`, defaulting to 5007.

## 🔐 Required Environment Variables

- DOCDB_URI
- DOCDB_DATABASE
- PROFILE_SERVICE_PORT

## 📑 Swagger Docs

API documentation is available at `/apidocs` for testing and exploration of the available endpoint.

## 🧾 Summary

The `getUserByUsername` microservice allows fast, secure, and easy access to user profile data by username. It is essential for applications that require username-based lookups in a microservice architecture.
