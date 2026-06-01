# ResolveAI Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Browser (http://localhost:5173)                     │   │
│  │  - React Components & Pages                          │   │
│  │  - Redux/Context for State Management                │   │
│  │  - React Router for Navigation                       │   │
│  │  - Axios for HTTP Calls                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST API
                    (JSON Payloads)
                            │
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (Spring Boot)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers (Port 8080)                             │   │
│  │  - AuthController                                    │   │
│  │  - IssueController                                   │   │
│  │  - FeedbackController                                │   │
│  │  - AnalyticsController                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Security Layer                                      │   │
│  │  - JwtAuthenticationFilter                           │   │
│  │  - JwtTokenProvider                                  │   │
│  │  - SecurityConfig                                    │   │
│  │  - UserDetailsService                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Service Layer                                       │   │
│  │  - AuthService                                       │   │
│  │  - IssueService                                      │   │
│  │  - FeedbackService                                   │   │
│  │  - AnalyticsService                                  │   │
│  │  - EmailService                                      │   │
│  │  - PriorityDetectionService                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Repository Layer (JPA)                              │   │
│  │  - UserRepository                                    │   │
│  │  - IssueRepository                                   │   │
│  │  - FeedbackRepository                                │   │
│  │  - EscalationRepository                              │   │
│  │  - EmailLogRepository                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                       JDBC Driver
                            │
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (MySQL)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database: resolveai_crm                             │   │
│  │  - users                                             │   │
│  │  - issues                                            │   │
│  │  - feedbacks                                         │   │
│  │  - escalations                                       │   │
│  │  - email_logs                                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Layered Architecture

### 1. **Presentation Layer** (React)
- User Interface components
- Page routing and navigation
- Form handling and validation
- State management (Context API)
- Error handling and notifications

### 2. **API Layer** (Spring Boot Controllers)
```
GET    /api/auth/login         → AuthController
POST   /api/issues             → IssueController
GET    /api/issues/all         → IssueController
PUT    /api/issues/{id}/assign → IssueController
GET    /api/reports            → AnalyticsController
GET    /api/users/csr          → UserController
```

### 3. **Security Layer** (Spring Security + JWT)
- Request authentication via JWT tokens
- Token validation and extraction
- Role-based access control (RBAC)
- Password encryption (BCrypt)

### 4. **Service Layer** (Business Logic)
```
AuthService
  - User registration
  - User login
  - Token generation

IssueService
  - Create issue
  - Update status
  - Assign to CSR
  - Escalate to manager
  - Auto-detect priority

FeedbackService
  - Submit feedback
  - Retrieve feedbacks

AnalyticsService
  - CSR performance metrics
  - Report generation
  - Statistics calculation

EmailService
  - Send notifications
  - Log email events
```

### 5. **Data Access Layer** (JPA Repositories)
```
JpaRepository Pattern
  ↓
Hibernate ORM
  ↓
SQL Queries
  ↓
MySQL Database
```

### 6. **Database Layer** (MySQL)
- Relational schema
- Indexing for performance
- Foreign key constraints
- Audit trails

## 🔐 Authentication & Authorization Flow

```
┌─────────────────┐
│  User Registers │
│  or Logs In     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  AuthController         │
│  - Validate credentials │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  AuthService            │
│  - Hash password        │
│  - Generate JWT token   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Return Token to Client │
│  Client stores in Local │
│  Storage                │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Subsequent API Requests            │
│  Include: Authorization: Bearer {jwt}
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  JwtAuthenticationFilter            │
│  - Extract token from header        │
│  - Validate token signature         │
│  - Check expiration                 │
│  - Load user details                │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  SecurityConfig                     │
│  - Check user role                  │
│  - Authorize endpoint access        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Proceed to Controller/Service      │
│  Execute business logic             │
└─────────────────────────────────────┘
```

## 🔄 Issue Management Flow

```
┌─────────────┐
│   CUSTOMER  │
│ Creates Issue
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ IssueService         │
│ - Auto-detect priority
│ - Store in DB        │
│ - Create in queue    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ EmailService         │
│ - Send confirmation  │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────┐
│ Status: OPEN, In Queue  │
│ Waiting for CSR         │
└──────┬──────────────────┘
       │
       ▼
┌─────────────┐
│    MANAGER  │
│ Assigns to CSR
│ or CSR pulls from queue
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ Status: IN_PROGRESS      │
│ Assigned to CSR          │
│ Email sent to customer   │
└──────┬───────────────────┘
       │
       ▼
┌─────────────┐
│     CSR     │
│ Updates status
└──────┬──────┘
       │
       ├─ ACCEPTED
       ├─ REJECTED
       ├─ RESOLVED ──► Email + Feedback Request
       ├─ CLOSED
       └─ ESCALATED ──► Manager review
```

## 📈 Data Model

### Issue Status Transitions
```
OPEN ──────────────────────► IN_PROGRESS
      (CSR pulls or assigned)      │
                                   ├─► ACCEPTED
                                   ├─► RESOLVED ──► CLOSED
                                   ├─► REJECTED
                                   └─► ESCALATED
```

### Role Permissions
```
CUSTOMER:
  - Create issue
  - View own issues
  - Submit feedback

CSR:
  - View assigned issues
  - View queue issues
  - Update status
  - Escalate issue

MANAGER:
  - View all issues
  - Assign to CSR
  - Send to queue
  - View escalated
  - View reports
  - View analytics
```

## 🔄 API Response Pattern

All endpoints return standardized JSON:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response payload
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔌 External Integrations

### Email Notifications (SMTP)
```
Application
     │
     ▼
JavaMailSender
     │
     ▼
SMTP Server (Gmail, Sendgrid, etc)
     │
     ▼
Email Logs (stored in DB)
     │
     ▼
Customer Email
```

## 📱 Frontend Architecture

### Component Hierarchy
```
App.jsx
├── Router
│   ├── AuthProvider
│   │   ├── Layout
│   │   │   ├── Navbar
│   │   │   └── Outlet
│   │   └── Pages
│   │       ├── Customer/*
│   │       ├── CSR/*
│   │       └── Manager/*
│   │
│   ├── Login
│   └── Register
```

### State Management
- **Auth Context**: User state, token, dark mode
- **API Calls**: Axios instance with interceptors
- **Local Storage**: Persistent user session

### API Interceptors
```
Request Interceptor:
  - Add Authorization header with token

Response Interceptor:
  - Handle 401: Logout and redirect to login
  - Handle errors: Show toast notifications
```

## 🚀 Deployment Architecture

### Production Setup
```
┌──────────────┐
│  CDN         │ (React build)
└──────┬───────┘
       │
┌──────┴───────────────┐
│                      │
│  React SPA           │
│  (static files)      │
└──────────────────────┘

┌──────────────────────┐
│  Spring Boot         │ (Docker container)
│  (JAR file)          │ (Port 8080)
│  - REST APIs         │
│  - JWT Auth          │
│  - Business Logic    │
└──────────┬───────────┘
           │
┌──────────┴──────────┐
│  MySQL Database     │ (Docker container)
│  (Persistent volume)│ (Port 3306)
└─────────────────────┘
```

## 🔍 Key Design Patterns

1. **Layered Architecture**: Clean separation of concerns
2. **Repository Pattern**: Data access abstraction
3. **Service Layer**: Business logic encapsulation
4. **Factory Pattern**: Bean creation in Spring
5. **Singleton Pattern**: Spring beans
6. **Strategy Pattern**: Different priority detection algorithms
7. **Observer Pattern**: Event-driven email notifications
8. **DTO Pattern**: Data transfer between layers

## 📊 Database Relationships

```sql
users
├── 1:N ──► issues (customer_id)
├── 1:N ──► issues (assigned_csr_id)
├── 1:N ──► escalations (escalated_by_id)
│
issues
├── 1:1 ──► feedbacks (issue_id)
├── 1:N ──► escalations (issue_id)
├── 1:N ──► email_logs (issue_id)
│
feedbacks
└── N:1 ──► users (customer_id)

escalations
└── N:1 ──► users (escalated_by_id)
```

## 🔧 Configuration Files

### Backend
- `application.properties`: Database, JWT, Mail, CORS
- `pom.xml`: Dependencies

### Frontend
- `vite.config.js`: Build configuration
- `tailwind.config.js`: Styling
- `postcss.config.js`: CSS processing

## 📚 Code Organization Principles

1. **Single Responsibility**: Each class has one reason to change
2. **Dependency Injection**: Spring manages dependencies
3. **DRY (Don't Repeat Yourself)**: Reusable components
4. **KISS (Keep It Simple)**: Clear, readable code
5. **SOLID Principles**: Applied throughout

---

This architecture ensures scalability, maintainability, and extensibility for future enhancements.
