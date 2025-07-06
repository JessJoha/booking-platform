# ✉️ Send Recovery Code Microservice

This microservice is part of the **User Management** domain and is responsible for generating and sending a temporary recovery code to a user's email address when they request to reset their password.

## 📌 Purpose

The purpose of this service is to securely send a 6-digit recovery code to users who have forgotten their password. The code is temporarily stored in Redis and is later validated by the reset password service.

## ⚙️ Features

- Receives an email and checks if the user exists in the database.
- Generates a random 6-digit recovery code.
- Sends the code via Gmail using an app-specific password.
- Stores the code temporarily in Redis (expires in 5 minutes).
- Includes Swagger documentation.
- Health check available at the root path.

## 🛠️ Technologies

- Python 3
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- Redis
- MySQL (AWS RDS)
- SMTP (Gmail)
- Flasgger (Swagger UI)
- Docker
- python-dotenv

## 📂 Folder Structure

- `app.py`: Initializes the application and registers routes.
- `config.py`: Loads environment variables.
- `routes/`: Contains the endpoint to request recovery code.
- `model/`: User model to validate emails.
- `utils/`: Utility to send emails via SMTP.
- `extensions.py`: Database and Redis clients setup.
- `.env`: Environment configuration file.
- `Dockerfile`: Container setup.
- `requirements.txt`: Python dependencies.
- `tests/`: For future unit and integration tests.

## 🔗 Connectivity

- Connects to a **MySQL** database to validate the user.
- Uses **Redis** to store recovery codes with a short TTL.
- Sends emails using **Gmail SMTP** credentials.

## 🌐 Endpoint

- POST `/recover/request`: Accepts an email and sends a recovery code if the user exists.

## 🔐 Required Environment Variables

- DB_URL, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT
- REDIS_HOST, REDIS_PORT
- GMAIL_USER, GMAIL_APP_PASSWORD
- SEND_SERVICE_PORT

## 📑 Swagger Docs

The API documentation is available at `/apidocs`, allowing interactive requests and testing.

## 🧾 Summary

The `sendRecoveryCode` microservice handles the generation and delivery of recovery codes to user emails. It ensures the codes are securely stored and expire after a short time to enhance password reset security.  
By default, this service runs on **port 5005**.
