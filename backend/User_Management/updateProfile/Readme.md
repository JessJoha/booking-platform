# ✏️ Update Profile Microservice

This microservice is part of the **User Management** domain and is responsible for updating the profile information of an authenticated user. It allows modifying fields such as phone number, avatar, and personal description.

## 📌 Purpose

The service enables authenticated users to make updates to their profile without modifying protected fields like username or email. JWT-based authentication ensures only valid users can access their own data.

## ⚙️ Features

- Updates a user profile by extracting the username from a valid JWT token.
- Supports updating phone number, avatar URL, and description.
- Connects to a MongoDB-compatible database to store profile data.
- Swagger documentation enabled.
- Health check available at the root route.

## 🛠️ Technologies

- Python 3
- Flask
- Flask-CORS
- PyJWT (for JWT decoding)
- MongoDB (or DocumentDB)
- Flasgger (Swagger UI)
- Docker
- python-dotenv

## 📂 Folder Structure

- `app.py`: Starts the Flask application.
- `routes/`: Contains logic to update profiles via PUT request.
- `config.py`: Loads and parses environment variables.
- `extensions.py`: MongoDB client setup.
- `.env`: Environment configuration file.
- `Dockerfile`: Container instructions.
- `requirements.txt`: List of dependencies.
- `tests/`: For future unit/integration tests.

## 🔗 Connectivity

- Connects to a **MongoDB-compatible** database named `profilesDB`.
- Validates user identity through a **JWT token**.
- Typically used from frontend dashboards or after login.

## 🌐 Endpoint

- **PUT** `/profile/`: Updates the profile data of the authenticated user.

## 🔐 Required Environment Variables

- `JWT_SECRET`
- `DOCDB_URI`
- `DOCDB_DATABASE`
- `PROFILE_SERVICE_PORT`

## 📑 Swagger Docs

The service exposes API documentation at `/apidocs` for easy testing and usage reference.

## 🧾 Summary

The `updateProfile` microservice enables users to personalize and maintain their profile information securely and efficiently.  
By default, this service runs on **port 5008**.
