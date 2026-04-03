# 🏦 Akshaya Bank Management System

A full-stack professional bank management system built with **Spring Boot + React + MySQL**.

---

## ✅ Pre-checked Installations (Your Windows Machine)
| Tool | Version | Status |
|------|---------|--------|
| Java | 21.0.9 LTS | ✅ |
| Maven | 3.9.14 | ✅ |
| Node.js | 25.2.1 | ✅ |
| npm | 11.6.2 | ✅ |
| MySQL | 8.0.44 | ✅ |
| Git | 2.53.0 | ✅ |

---

## 🚀 HOW TO RUN (Step by Step)

### Step 1 — Setup MySQL Database
Open **MySQL Workbench** or PowerShell and run:
```sql
CREATE DATABASE IF NOT EXISTS akshaya_bank;
```
Or run the provided script:
```powershell
mysql -u root -pSystem < setup-database.sql
```

### Step 2 — Start the Backend
Open PowerShell in the `backend/` folder and run:
```powershell
mvn clean install -DskipTests
mvn spring-boot:run
```
**OR** just double-click `start-backend.bat`

Backend runs at → **http://localhost:8080/api**

### Step 3 — Start the Frontend
Open a NEW PowerShell in the `frontend/` folder and run:
```powershell
npm install
npm run dev
```
**OR** just double-click `start-frontend.bat`

Frontend runs at → **http://localhost:5173**

---

## 🔐 Login Credentials

### Admin
- **Email:** gaddamakshaya@gmail.com
- **Password:** akshaya@123
- **Access:** Full admin panel — manage customers, accounts, transactions

### Customers
- Created by the admin with their own email and password
- Login at the same page → redirected to Customer Panel automatically

---

## 🎯 Features

### Admin Panel
- ✅ Dashboard with live charts & statistics
- ✅ Create / Edit / Deactivate customers
- ✅ Open bank accounts (Savings / Current / Fixed Deposit)
- ✅ Freeze / Close / Reactivate accounts
- ✅ View all transactions
- ✅ Admin deposit — credit any account directly

### Customer Panel
- ✅ Dashboard with total balance & account cards
- ✅ Deposit money into own accounts
- ✅ Withdraw money from own accounts
- ✅ Fund Transfer using account number
- ✅ Full transaction history with filters
- ✅ Mini statement (last 10 txns)
- ✅ Edit profile & change password

---

## 🌐 Going Live Later (Render + Vercel)

### Backend → Render.com (free)
1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on Render
3. Set environment variables:
   - `DATABASE_URL` → from Railway MySQL
   - `DATABASE_USER` → from Railway
   - `DATABASE_PASSWORD` → from Railway
   - `JWT_SECRET` → any long random string
   - `FRONTEND_URL` → your Vercel URL
   - `SPRING_PROFILES_ACTIVE` → `cloud`
4. Build command: `mvn clean install -DskipTests`
5. Start command: `java -jar target/bank-1.0.0.jar`

### Frontend → Vercel.com (free)
1. Push `frontend/` to GitHub
2. Import on Vercel → set framework to **Vite**
3. Set env variable: `VITE_API_URL` → your Render backend URL
4. In `api.js`, change `baseURL` to `import.meta.env.VITE_API_URL`

### Database → Railway.app (free tier)
1. Create a MySQL instance on Railway
2. Copy the connection string → paste into Render env vars

---

## 📁 Project Structure
```
bankapp/
├── backend/                    ← Spring Boot
│   ├── src/main/java/com/akshaya/bank/
│   │   ├── entity/             ← User, BankAccount, Transaction
│   │   ├── repository/         ← JPA Repositories
│   │   ├── service/            ← Business logic
│   │   ├── controller/         ← REST APIs
│   │   ├── security/           ← JWT + Spring Security
│   │   ├── dto/                ← Request/Response objects
│   │   └── exception/          ← Global error handler
│   └── src/main/resources/
│       ├── application.properties        ← Local config
│       └── application-cloud.properties  ← Cloud config
│
└── frontend/                   ← React + Vite
    └── src/
        ├── pages/admin/        ← Admin dashboard, users, accounts, txns
        ├── pages/customer/     ← Customer dashboard, transfer, profile
        ├── components/         ← Layouts (sidebars)
        ├── services/api.js     ← All API calls
        └── context/AuthContext ← JWT auth state
```

---

## ⚠️ Troubleshooting

**MySQL connection error?**
- Check your MySQL password in `backend/src/main/resources/application.properties`
- Current password set to: `System`
- Change it if different: `spring.datasource.password=YOUR_PASSWORD`

**Port already in use?**
- Backend: Change `server.port=8081` in application.properties
- Frontend: Change port in vite.config.js

**CORS error in browser?**
- Make sure backend is running before frontend
- Check `app.cors.allowed-origins` in application.properties
