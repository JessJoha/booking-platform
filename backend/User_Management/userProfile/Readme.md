# 👤 User Profile Microservice

This microservice is part of the **User Management** domain and is responsible for managing user profile information. It supports the creation and retrieval of user profiles using JWT authentication and stores data in a MongoDB-compatible database.

## 📌 Purpose

The service allows authenticated users to initialize or retrieve their profile. Profiles include details such as email, avatar, phone number, and a personal description. The profile is linked to the authenticated user via the JWT token.

## ⚙️ Features

- Initializes a user profile if it does not exist (based on JWT token).
- Retrieves the authenticated user's profile.
- Requires a valid JWT token in the Authorization header.
- Uses MongoDB (DocumentDB) for profile storage.
- Provides Swagger UI for testing.
- Health check endpoint available.

## 🛠️ Technologies

- Python 3
- Flask
- MongoDB (or DocumentDB)
- Flask-CORS
- PyJWT (JWT validation)
- Flasgger (Swagger UI)
- Docker
- python-dotenv

## 📂 Folder Structure

- `app.py`: Starts the service and registers routes.
- `routes/`: Contains `/init` and `/` endpoints for profile management.
- `model/`: Defines the `UserProfile` structure and serialization.
- `config.py`: Loads environment variables and settings.
- `extensions.py`: MongoDB client configuration.
- `.env`: Contains configuration like DB connection and JWT secret.
- `docker-compose.yml` / `Dockerfile`: Container configuration.
- `requirements.txt`: Dependencies.
- `tests/`: Folder for future test cases.

## 🔗 Connectivity

- Uses a **MongoDB-compatible** database (`profilesDB`) to store user profiles.
- Requires a valid **JWT token** to identify and authorize the user.
- Typically called after authentication during login or registration.

## 🌐 Endpoints

- **POST** `/profile/init`: Initializes the user's profile if it doesn't exist.
- **GET** `/profile/`: Retrieves the profile of the authenticated user.

## 🔐 Required Environment Variables

- `JWT_SECRET`
- `DOCDB_URI`
- `DOCDB_DATABASE`
- `PROFILE_SERVICE_PORT`

## 📑 Swagger Docs

Interactive API documentation is available at `/apidocs`.

## 🧾 Summary

The `userProfile` microservice is responsible for creating and managing user profiles securely, based on information extracted from JWT tokens.  
By default, this service runs on **port 5010**.
