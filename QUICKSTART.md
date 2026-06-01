# ResolveAI - Quick Start Guide

Get the application running in 5 minutes!

## ⚡ Prerequisites
- MySQL 8.0+
- Java 17+
- Node.js 18+

## 🚀 Step 1: Database Setup (2 minutes)

### On Windows/Mac/Linux:
```bash
# Open MySQL command line
mysql -u root -p

# Paste the contents of schema.sql
# Then run it
source /path/to/schema.sql;
```

Or use MySQL Workbench to import `schema.sql`.

## 🔧 Step 2: Backend Setup (2 minutes)

### Navigate to backend directory
```bash
cd /Users/I578356/Desktop/CRM/resolveai-backend
```

### Update application.properties
Edit `src/main/resources/application.properties`:
```properties
# MySQL credentials
spring.datasource.password=YOUR_MYSQL_PASSWORD

# For Gmail email sending (optional):
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
```

### Run backend
```bash
mvn spring-boot:run
```

**✅ Backend running on http://localhost:8080**

## 💻 Step 3: Frontend Setup (1 minute)

### In new terminal, navigate to frontend:
```bash
cd /Users/I578356/Desktop/CRM/resolveai-frontend
npm install
npm run dev
```

**✅ Frontend running on http://localhost:5173**

## 🎯 Step 4: Test the Application

### Option A: Test with Sample Users
Database includes sample users. Login as:
- **Customer**: `customer@example.com` / `password`
- **CSR**: `csr@example.com` / `password`
- **Manager**: `manager@example.com` / `password`

### Option B: Create New Account
Click "Register" on login page to create account

## 📋 Sample User Flow

### 1. Customer Creates Issue
1. Login as customer: `customer@example.com`
2. Click "New Issue"
3. Enter title and description
4. Submit (priority auto-detects)

### 2. Manager Assigns Issue
1. Login as manager: `manager@example.com`
2. Go to "All Issues"
3. Click "Assign" button
4. Select a CSR
5. Issue assigned to CSR

### 3. CSR Works on Issue
1. Login as CSR: `csr@example.com`
2. Go to "Assigned Issues"
3. Update status to "IN_PROGRESS" → "RESOLVED"
4. Issue resolved

### 4. Customer Provides Feedback
1. Login as customer
2. See resolved issue
3. Click "Feedback"
4. Rate 1-5 stars and comment

### 5. Manager Views Reports
1. Login as manager
2. Go to "Reports"
3. View charts, analytics, CSR performance
4. Export to CSV

## 🔍 Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:8080/api/users/csr
# Should return 401 (requires token)
```

### Frontend Loading
Open http://localhost:5173 in browser
Should see login page

## 🛠️ Common Issues

### MySQL Connection Error
```
ERROR: Connection refused
FIX: 
  - Ensure MySQL is running
  - Check credentials match your setup
  - Verify database exists: SHOW DATABASES;
```

### Port Already in Use
```
ERROR: Port 8080/5173 already in use
FIX:
  - Change ports in application.properties and vite.config.js
  - Or kill existing processes on those ports
```

### JWT Token Invalid
```
ERROR: 401 Unauthorized
FIX:
  - Clear browser localStorage
  - Re-login to get fresh token
  - Check jwt.secret in application.properties
```

## 📚 API Examples

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password"}'
```

### Create Issue (requires token)
```bash
curl -X POST http://localhost:8080/api/issues \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "issueTitle": "Payment not received",
    "issueDescription": "I made payment but funds not received",
    "issueType": "COMPLAINT"
  }'
```

## 🎓 Next Steps

1. **Explore the Features**: Create issues, assign, escalate, provide feedback
2. **Check the Code**: Review architecture in main README
3. **Customize**: Modify colors, add fields, extend features
4. **Deploy**: Follow deployment section in README for production

## 📞 Support

See main **README.md** for:
- Full API documentation
- Database schema details
- Tech stack information
- Architecture overview

---

**You're all set! Enjoy ResolveAI 🎉**
