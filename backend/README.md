# AwebAI API Backend

This is a production-ready, lightweight Node.js & Express.js backend that handles contact submissions and quote requests for the AwebAI agency platform, persisting entries directly to MongoDB Atlas.

---

## 📁 Project Structure
```
backend/
  ├── config/
  │     └── db.js         # Mongoose connection initialization
  ├── models/
  │     ├── Contact.js    # Contact mongoose collection schema
  │     └── Quote.js      # Quote mongoose collection schema
  ├── routes/
  │     ├── contact.js    # /api/contact submissions router
  │     └── quote.js      # /api/quote submissions router
  ├── .env.example        # Environment variables template
  ├── .gitignore          # Version control ignore definitions
  ├── package.json        # Dependencies configurations
  └── server.js           # Server initializer & central error handler
```

---

## ⚡ Prerequisites
Make sure you have the following installed on your machine:
* **Node.js** (v16.0.0 or higher)
* **npm** (comes bundled with Node.js)
* **MongoDB Atlas account** (or a local running instance of MongoDB)

---

## ⚙️ Local Development Setup

### 1. Copy Environment File
Duplicate the environment template file:
```bash
cp .env.example .env
```
*(On Windows PowerShell, use: `Copy-Item .env.example .env`)*

### 2. Configure Environment Variables
Open the new `.env` file and set your credentials:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/awebai
FRONTEND_URL=http://localhost:8080,http://127.0.0.1:8080
```
* **MONGO_URI**: Enter your actual MongoDB connection string from Atlas.
* **FRONTEND_URL**: Origins that are allowed to make CORS requests to the API.

### 3. Install Dependencies
Run npm install in the `backend/` directory:
```bash
npm install
```

### 4. Run the Server
* **For development mode (with live reload via nodemon):**
  ```bash
  npm run dev
  ```
* **For production mode:**
  ```bash
  npm start
  ```
The server will start listening on `http://localhost:5000`.

---

## 📡 API Reference

### 1. Submit Contact Form
* **Endpoint:** `POST /api/contact`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "service": "Web Development",
    "message": "We need a custom landing page for our SaaS startup."
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Inquiry sent successfully! We will get back to you within 24 hours.",
    "data": {
      "id": "603d2b27bc1d2c17c46a6f1a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "service": "Web Development",
      "createdAt": "2026-06-26T12:00:00.000Z"
    }
  }
  ```

### 2. Submit Quote Request
* **Endpoint:** `POST /api/quote`
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@company.com",
    "company": "Smith Tech",
    "website": "https://smithtech.com",
    "service": "AI & Chatbots",
    "budget": "$5,000 - $10,000",
    "timeline": "1 - 3 Months",
    "message": "Need a fine-tuned customer support agent integrated with Slack."
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Quote request submitted successfully! We will analyze and reply within 24 hours.",
    "data": {
      "id": "603d2b37bc1d2c17c46a6f1b",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "service": "AI & Chatbots",
      "budget": "$5,000 - $10,000",
      "timeline": "1 - 3 Months",
      "createdAt": "2026-06-26T12:05:00.000Z"
    }
  }
  ```

---

## 🚀 Production Deployment

### Recommended Platforms
This Node.js backend is stateless and fits perfectly on any PaaS (Platform-as-a-Service) hosting providers:
* **Render** (Free tier available, simple GitHub integration)
* **Railway** (Fast, modern developer-focused deployment)
* **Heroku** (Standard container-based deployment)
* **Vercel** or **Netlify** (via serverless API functions)

### Deployment Checklists
1. **Database IP Access List:**
   * In MongoDB Atlas dashboard under Network Security, ensure you add the deployment server's IP address (or `0.0.0.0/0` to allow connections from any serverless origin).
2. **Environment Variables:**
   * Configure `PORT`, `MONGO_URI`, and `FRONTEND_URL` under your hosting provider's Environment variables section (do not commit your `.env` to Git).
   * Set `NODE_ENV` to `production`.
3. **Frontend Connection:**
   * Update the production URL endpoint in your frontend's `js/navigation.js` file:
     ```javascript
     const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
         ? "http://localhost:5000"
         : "https://your-deployed-backend-url.onrender.com"; // Paste deployment URL here
     ```
