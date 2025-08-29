Of course! Here is a complete and professional `README.md` file for the "Notifier" project, based on the provided code and task requirements.

---

# Notifier - A Full-Stack Notification System API (Email/SMS)

Notifier is a robust, full-stack application designed to send, schedule, and track notifications via email and SMS. It features a RESTful API backend built with Node.js and Express, and a modern, responsive frontend built with React and Tailwind CSS. The system is designed for scalability and reliability, utilizing a job queue (Bull with Redis) for asynchronous notification processing and integration with third-party services like Nodemailer and Infobip.

## ✨ Features

*   **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
*   **Email Notifications**: Send emails to single or multiple recipients.
*   **SMS Notifications**: Send SMS messages to single or multiple recipients.
*   **Template Management**: Full CRUD functionality for creating, reading, updating, and deleting dynamic templates for both email and SMS. Placeholders like `{variable}` are automatically detected and can be replaced.
*   **Asynchronous Processing**: Uses **Bull** and **Redis** to queue notification jobs, ensuring the API remains fast and responsive without waiting for external services.
*   **Notification History**: Track the status (`pending`, `sent`, `failed`) of every notification sent by a user.
*   **Automatic Retries**: Implements a retry mechanism with exponential backoff for failed SMS jobs, enhancing reliability.
*   **Scheduling**: Ability to schedule notifications for a future date and time.
*   **Input Validation**: Validates email addresses and formats Pakistan phone numbers for consistency.
*   **Secure Endpoints**: All core API routes are protected and require user authentication.
*   **Responsive Frontend**: A complete user interface built with React to manage templates and send notifications.

## 🚀 Live Demo

[A live version of the application can be accessed here - *link to your deployed app*]

## 📸 Screenshots

| Login Page                                  | Dashboard                                    |
| ------------------------------------------- | -------------------------------------------- |
|  |  |

| Notifications Page                          | Templates Page                               |
| ------------------------------------------- | -------------------------------------------- |
|  |  |

## 🛠️ Tech Stack

| Category      | Technology                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| **Frontend**  | React, React Router, Tailwind CSS, Axios, Headless UI, react-hot-toast                                        |
| **Backend**   | Node.js, Express.js                                                                                           |
| **Database**  | MongoDB with Mongoose                                                                                         |
| **Job Queue** | [Bull](https://github.com/OptimalBits/bull) for job processing & [Redis](https://redis.io/) as the message broker |
| **Auth**      | JSON Web Tokens (JWT), bcrypt.js                                                                              |
| **Email**     | [Nodemailer](https://nodemailer.com/) (with Ethereal for development)                                           |
| **SMS**       | [Infobip SDK](https://www.infobip.com/docs/api) (with a mock service fallback)                                  |

## 🏗️ Architecture

```mermaid
graph TD
    A[React Client] <--> B{REST API (Node.js/Express)};
    B <--> C[MongoDB (Database)];
    B -- Enqueues Job --> D[Redis (Bull Queue)];
    E[Worker Process] -- Processes Job --> D;
    E -- Sends Email --> F[Nodemailer / Ethereal];
    E -- Sends SMS --> G[Infobip API];
    E -- Updates Status --> C;
```

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   **Node.js**: v16 or later
*   **MongoDB**: An active instance (local or cloud, e.g., MongoDB Atlas)
*   **Redis**: An active instance for the Bull message queue

### 1. Clone the Repository

```bash
git clone <repository-url>
cd notifier-project
```

### 2. Backend Setup

Navigate to the backend directory (assuming it's the root or a `/server` folder) and install dependencies.

```bash
# cd server (if you have a separate server folder)
npm install
```

Create a `.env` file in the root of the backend directory and populate it with the following variables:

```env
# .env

# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/notifierDB

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Redis for Bull Queue
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email Service (Nodemailer)
# For production, use real credentials. For development, Ethereal is used automatically.
FROM_EMAIL="Notifier <noreply@example.com>"
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=user@example.com
EMAIL_PASS=password

# SMS Service (Infobip)
# If these are not provided, a mock SMS service will be used.
INFOBIP_BASE_URL=your_infobip_base_url
INFOBIP_API_KEY=your_infobip_api_key
INFOBIP_SENDER_ID=InfoSMS
```

### 3. Frontend Setup

Navigate to the frontend directory (assuming `/client` or `/` if it's a monorepo) and install dependencies.

```bash
# cd client (if you have a separate client folder)
npm install
```

Create a `.env` file in the root of the frontend directory and add the API base URL.

```env
# client/.env

VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Running the Application

You can run the backend and frontend servers in separate terminals.

**Run Backend Server:**

```bash
npm run dev # Or 'npm start'
```

**Run Frontend Development Server:**

```bash
npm run dev
```

The application should now be running:
*   Frontend: `http://localhost:5173` (or your Vite port)
*   Backend API: `http://localhost:5000`

## 📦 API Endpoints

The base URL for all endpoints is `/api`. All protected routes require an `Authorization: Bearer <token>` header.

### Authentication (`/auth`)

| Method | Endpoint         | Auth       | Description                                  |
|--------|------------------|------------|----------------------------------------------|
| `POST` | `/register`      | Public     | Register a new user.                         |
| `POST` | `/login`         | Public     | Log in to get a JWT token.                   |
| `GET`  | `/profile`       | Protected  | Get the profile of the currently logged-in user. |

### Notifications (`/notifications`)

| Method | Endpoint         | Auth       | Description                                  |
|--------|------------------|------------|----------------------------------------------|
| `POST` | `/email`         | Protected  | Queue an email notification for sending.     |
| `POST` | `/sms`           | Protected  | Queue an SMS notification for sending.       |
| `GET`  | `/`              | Protected  | Get notification history for the user (paginated). |
| `GET`  | `/:id`           | Protected  | Get details of a single notification.        |

**Example `POST /email` Request Body:**
```json
{
    "to": ["user1@example.com", "user2@example.com"],
    "subject": "Welcome to Notifier!",
    "templateName": "welcome-email",
    "variables": { "username": "Alex" },
    "schedule": "2024-10-26T10:00:00Z" // Optional
}
```

**Example `POST /sms` Request Body:**
```json
{
    "to": "03001234567",
    "templateName": "otp-sms",
    "variables": { "code": "123456" }
}
```

### Templates (`/templates`)

| Method   | Endpoint | Auth      | Description                        |
|----------|----------|-----------|------------------------------------|
| `POST`   | `/`      | Protected | Create a new template.             |
| `GET`    | `/`      | Protected | Get all templates created by the user. |
| `GET`    | `/:id`   | Protected | Get a single template by ID.       |
| `PUT`    | `/:id`   | Protected | Update an existing template.       |
| `DELETE` | `/:id`   | Protected | Delete a template.                 |

**Example `POST /templates` Request Body:**
```json
{
    "name": "welcome-email",
    "type": "email",
    "subject": "Welcome, {username}!",
    "content": "<h1>Hello {username}</h1><p>Thanks for joining our platform.</p>"
}
```

## ✅ Bonus Features Implemented

*   **Retry Failed Notifications**: The Bull queue processor automatically retries failed SMS jobs up to 3 times with an exponential backoff strategy.
*   **Support Bulk Notifications**: The `to` field in the notification endpoints accepts both a single recipient string and an array of strings for bulk sending.
*   **User-Specific Dashboard**: The `GET /notifications` endpoint acts as a history/dashboard endpoint, showing only the notifications created by the authenticated user.
*   **Scheduling**: The `schedule` field allows notifications to be sent at a specified future time.
*   **HTML Templates**: The email service supports sending rich HTML content in templates.

---
