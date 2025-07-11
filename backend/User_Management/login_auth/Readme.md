# 🔐 Login Auth Microservice

This microservice is part of the **User Management** domain and is responsible for authenticating users by verifying their credentials and issuing a secure JWT token. It also interacts with the profile service to initialize user profiles if needed.

## 📌 Purpose

The goal of this service is to securely validate login attempts and generate access tokens for authenticated users. It acts as the authentication entry point for the entire platform.

## ⚙️ Features

- Receives login requests with username and password.
- Validates user credentials using hashed passwords.
- Issues a JWT token on successful login.
- Sends a request to the profile microservice to create or verify the user profile.
- Includes Swagger documentation for easy testing.
- Health check available on root path.

## 🛠️ Technologies

- Python 3
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- Flasgger (Swagger UI)
- MySQL (hosted on RDS)
- JWT (JSON Web Tokens)
- bcrypt (for password hashing)
- Docker

## 📂 Folder Structure

- `app.py`: Main application entry point.
- `config.py`: Loads environment variables for database and secrets.
- `routes/`: Contains the `/login` endpoint logic.
- `models/`: User model and password verification.
- `extensions.py`: Flask extension setup.
- `.env`: Environment configuration.
- `Dockerfile`: Docker build configuration.
- `requirements.txt`: Python dependencies.
- `tests/`: Test directory for future validation.

## 🔗 Connectivity

This service connects to a **MySQL** database for credential validation and calls the **profile microservice** after login to initialize or verify the user's profile.

## 🌐 Endpoint

- POST `/auth/login`: Accepts a username and password, returns a JWT token if valid.

## 🔐 Required Environment Variables

- JWT_SECRET
- SECRET_KEY
- DB_URL
- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_PORT
- ACCESS_TOKEN_EXPIRATION
- LOGIN_SERVICE_PORT

## 📑 Swagger Docs

Documentation is available at `/apidocs` for testing and interacting with the login endpoint.

## 🧾 Summary

The `login_auth` microservice handles secure user login and token issuance, ensuring authentication flows are fast, secure, and integrated with the user profile system.  
By default, this service runs on **port 5000**.
