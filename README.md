# ResolveAI – Customer Relationship Management System

A complete production-ready full-stack CRM application for managing customer issues, complaints, suggestions, and service requests.

## 🎯 Features

### ✅ Core Features
- **User Management**: Register and login as Customer, CSR, or Manager
- **Issue Tracking**: Create, assign, and track customer issues
- **Issue Status Management**: OPEN → IN_PROGRESS → RESOLVED/REJECTED/CLOSED
- **Escalation System**: CSRs can escalate complex issues to managers
- **Common Queue**: Unassigned issues sit in queue for CSRs to pull
- **Feedback Collection**: Customers provide ratings and feedback after resolution
- **Performance Analytics**: Detailed CSR performance metrics and reports
- **Email Notifications**: Automatic email alerts on issue creation, assignment, resolution
- **Priority Detection**: Auto-detect HIGH/MEDIUM/LOW priority based on keywords

### 📊 Dashboard Analytics
- CSR performance metrics (resolved, pending, escalations, avg rating)
- Issue status distribution
- Feedback analytics
- CSV export for reports
- Interactive charts and graphs

## 🏗️ Tech Stack

### Backend
- **Spring Boot 3.2.5** - REST API framework
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - ORM & database access
- **Hibernate** - Object-relational mapping
- **MySQL** - Relational database
- **JavaMailSender** - Email notifications
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📂 Project Structure

```
CRM/
├── resolveai-backend/              (Spring Boot)
│   ├── src/
│   │   ├── main/java/com/resolveai/crm/
│   │   │   ├── CrmApplication.java
│   │   │   ├── config/              (Security, Mail config)
│   │   │   ├── controller/          (REST endpoints)
│   │   │   ├── dto/                 (Request/Response DTOs)
│   │   │   ├── entity/              (JPA entities + enums)
│   │   │   ├── exception/           (Exception handling)
│   │   │   ├── repository/          (JPA repositories)
│   │   │   ├── security/            (JWT, authentication)
│   │   │   ├── service/             (Business logic)
│   │   │   └── util/                (Utilities)
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
│
├── resolveai-frontend/              (React + Vite)
│   ├── src/
│   │   ├── api/                     (API calls)
│   │   ├── components/              (Reusable components)
│   │   ├── context/                 (Auth context)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── customer/            (Customer pages)
│   │   │   ├── csr/                 (CSR pages)
│   │   │   └── manager/             (Manager pages)
│   │   ├── App.jsx                  (Main router)
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── schema.sql                        (Database schema)
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+**
- **npm 9+**
- **MySQL 8.0+**
- **Git**

### Backend Setup

#### 1. Database Setup
```bash
# Start MySQL and create database
mysql -u root -p < schema.sql
```

The schema includes sample users (for testing):
- **Customer**: customer@example.com (password: password)
- **CSR**: csr@example.com (password: password)
- **Manager**: manager@example.com (password: password)

#### 2. Configure Backend

Navigate to backend directory:
```bash
cd resolveai-backend
```

Edit `src/main/resources/application.properties`:
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/resolveai_crm?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT Secret (use a secure, long random string)
app.jwt.secret=your-super-secret-jwt-key-at-least-256-bits-long

# Email Configuration (Gmail example)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# CORS
app.cors.allowed-origins=http://localhost:5173
```

#### 3. Build & Run Backend

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will start at `http://localhost:8080`

### Frontend Setup

#### 1. Install Dependencies

```bash
cd resolveai-frontend
npm install
```

#### 2. Run Development Server

```bash
npm run dev
```

Frontend will start at `http://localhost:5173`

#### 3. Build for Production

```bash
npm run build
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
```

### Issues (Customer)
```
POST   /api/issues                 - Create new issue
GET    /api/issues/my              - Get my issues
```

### Issues (Manager)
```
GET    /api/issues/all             - Get all issues
PUT    /api/issues/{id}/assign     - Assign issue to CSR
PUT    /api/issues/{id}/queue      - Send to queue
```

### Issues (CSR)
```
GET    /api/issues/assigned        - Get assigned issues
GET    /api/issues/queue           - Get queue issues
PUT    /api/issues/{id}/pull       - Pull from queue
PUT    /api/issues/{id}/status     - Update status
PUT    /api/issues/{id}/escalate   - Escalate issue
```

### Escalations
```
GET    /api/issues/escalated       - Get escalated issues
```

### Feedback
```
POST   /api/feedback               - Submit feedback
GET    /api/feedback               - Get all feedbacks (Manager)
```

### Analytics
```
GET    /api/analytics/csr-performance  - CSR performance metrics
GET    /api/reports                    - System report & charts
```

### Users
```
GET    /api/users/csr               - Get all CSRs (Manager)
```

## 🔐 Authentication & Authorization

### JWT Token Flow
1. User registers/logs in
2. Server returns JWT token
3. Client stores token in localStorage
4. Token sent in `Authorization: Bearer <token>` header
5. Server validates token in each request

### Role-Based Access Control
- **CUSTOMER**: Can create/view own issues, submit feedback
- **CSR**: Can view assigned/queue issues, update status, escalate
- **MANAGER**: Can view all issues, assign, escalate, view reports

## 🗄️ Database Design

### Tables
- **users** - User accounts with roles
- **issues** - Customer issues with status tracking
- **feedbacks** - Customer feedback for resolved issues
- **escalations** - Issue escalation audit trail
- **email_logs** - Email notification tracking

### Key Relationships
```
User (Customer) ─ 1:N ─ Issue
User (CSR) ─ 1:N ─ Issue (assigned_csr_id)
Issue ─ 1:1 ─ Feedback
Issue ─ 1:N ─ Escalation
User (CSR) ─ 1:N ─ Escalation
```

## 🎨 UI Features

### Dark Mode
Toggle dark/light theme via navbar button. Preference persists in localStorage.

### Responsive Design
- Mobile-first approach
- Fully responsive on all screen sizes
- Touch-friendly on mobile devices

### Status & Priority Badges
- Color-coded status badges
- Color-coded priority indicators
- Real-time status updates

### Charts & Analytics
- Bar charts for status distribution
- Pie charts for issue overview
- Line charts for rating trends
- CSV export functionality

## 📧 Email Notifications

The system sends emails on:
1. **Issue Created** - Customer receives confirmation
2. **Issue Assigned** - Customer notified of CSR assignment
3. **Issue Resolved** - Customer notified to submit feedback
4. **Issue Closed** - Final notification to customer
5. **Feedback Request** - Reminder to provide feedback

Configure SMTP in `application.properties` for email delivery.

## 🔍 Priority Detection

Keywords are automatically analyzed:
- **HIGH**: "payment failed", "refund", "urgent", "fraud", "hacked"
- **LOW**: "suggestion", "feature", "idea", "thank you", "goodwill"
- **MEDIUM**: Default for others

## 🧪 Testing

### Sample Users
After running schema.sql, test with:
- **Customer**: `customer@example.com` / `password`
- **CSR**: `csr@example.com` / `password`
- **Manager**: `manager@example.com` / `password`

### Create Issue Flow
1. Login as customer
2. Create issue with auto-detected priority
3. Login as manager, assign to CSR
4. Login as CSR, update status
5. Customer provides feedback after resolution
6. Manager views reports

## 🐛 Troubleshooting

### Backend Won't Start
```
ERROR: Connection to localhost:3306 refused
SOLUTION: Ensure MySQL is running
         Check credentials in application.properties
```

### Frontend API Errors
```
ERROR: 401 Unauthorized
SOLUTION: Clear localStorage
         Re-login to get fresh token
```

### Email Not Sending
```
SOLUTION: Enable "Less secure app access" for Gmail
         Use app-specific password
         Check SMTP settings in properties
```

## 📝 Development Notes

### Adding New Features
1. Create backend entity/DTO
2. Add repository/service/controller
3. Create frontend component/page
4. Add routing in App.jsx
5. Test with API postman/curl

### Database Migrations
Use Hibernate's `ddl-auto: update` for dev, `validate` for prod

## 📄 License

MIT License - Feel free to use for personal/commercial projects

## 👨‍💻 Author

Built as a complete full-stack CRM system with modern technologies.

---

## 🎓 Learning Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev)
- [JWT Auth](https://jwt.io)
- [TailwindCSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

---

**Happy coding! 🚀**
