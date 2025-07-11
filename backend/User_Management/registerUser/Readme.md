# 📝 Register User Microservice

This microservice is part of the **User Management** domain and is responsible for registering new users in the system. It securely saves user credentials and information into a MySQL database and performs basic validation.

## 📌 Purpose

The goal of this service is to allow new users to register by providing a username, password, phone number, and email. It ensures that usernames and phone numbers are unique and securely stores hashed passwords.

## ⚙️ Features

- Registers new users via POST request.
- Validates required fields and prevents duplicates.
- Hashes passwords before storing them.
- Saves user data into a MySQL database.
- Includes Swagger UI documentation.
- Health check available on the root path.

## 🛠️ Technologies

- Python 3
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- Flasgger (Swagger UI)
- MySQL (AWS RDS)
- Docker
- python-dotenv

## 📂 Folder Structure

- `app.py`: Starts the Flask application and configures extensions.
- `config.py`: Loads environment variables.
- `routes/`: Handles the user registration route.
- `model/`: Contains the SQLAlchemy user model.
- `extensions.py`: Initializes database extensions.
- `.env`: Environment settings (DB credentials, port, etc.).
- `Dockerfile`: Docker container configuration.
- `requirements.txt`: Python dependencies.
- `tests/`: Future test implementations.

## 🔗 Connectivity

This service connects to a remote **MySQL** database and is intended to work alongside services like login and profile management.

## 🌐 Endpoint

- POST `/auth/users/register`: Registers a new user with required fields.

## 🔐 Required Environment Variables

- SECRET_KEY
- JWT_SECRET
- DB_URL
- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_PORT
- ACCESS_TOKEN_EXPIRATION
- REGISTER_SERVICE_PORT

## 📑 Swagger Docs

API documentation is available at `/apidocs`, offering an interactive UI to test the registration process.

## 🧾 Summary

The `registerUser` microservice provides secure and reliable user registration functionality and ensures data integrity during the onboarding process.  
By default, this service runs on **port 5001**.
