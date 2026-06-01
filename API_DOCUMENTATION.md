# ResolveAI API Documentation

Complete REST API reference for ResolveAI CRM System.

## 🔑 Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "userId": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}

Response (200):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "...",
    "tokenType": "Bearer",
    "userId": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }
}
```

## 🎫 Issue Management

### Create Issue (Customer)
```http
POST /api/issues
Authorization: Bearer <token>
Content-Type: application/json

{
  "issueTitle": "Payment not received",
  "issueDescription": "I paid $100 but amount not credited",
  "issueType": "COMPLAINT"
}

Response (200):
{
  "success": true,
  "message": "Issue created",
  "data": {
    "id": 1,
    "issueTitle": "Payment not received",
    "issueDescription": "I paid $100 but amount not credited",
    "issueType": "COMPLAINT",
    "status": "OPEN",
    "priority": "HIGH",
    "customerId": 1,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "assignedCsrId": null,
    "assignedCsrName": null,
    "escalationReason": null,
    "inQueue": true,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00",
    "resolvedAt": null
  }
}
```

### Get My Issues (Customer)
```http
GET /api/issues/my
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "issueTitle": "Payment not received",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "customerName": "John Doe",
      "assignedCsrName": "Jane CSR",
      "createdAt": "2024-01-15T10:30:00",
      ...
    }
  ]
}
```

### Get All Issues (Manager)
```http
GET /api/issues/all
Authorization: Bearer <token>
Role: MANAGER

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "issueTitle": "...",
      "status": "...",
      ...
    },
    {
      "id": 2,
      ...
    }
  ]
}
```

### Assign Issue to CSR (Manager)
```http
PUT /api/issues/{issueId}/assign
Authorization: Bearer <token>
Role: MANAGER
Content-Type: application/json

{
  "csrId": 2
}

Response (200):
{
  "success": true,
  "message": "Issue assigned",
  "data": {
    "id": 1,
    "status": "IN_PROGRESS",
    "assignedCsrId": 2,
    "assignedCsrName": "Jane CSR",
    ...
  }
}
```

### Send Issue to Queue (Manager)
```http
PUT /api/issues/{issueId}/queue
Authorization: Bearer <token>
Role: MANAGER

Response (200):
{
  "success": true,
  "message": "Issue sent to queue",
  "data": {
    "id": 1,
    "status": "OPEN",
    "inQueue": true,
    "assignedCsrId": null,
    ...
  }
}
```

### Get Queue Issues (CSR)
```http
GET /api/issues/queue
Authorization: Bearer <token>
Role: CSR

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 3,
      "issueTitle": "Feature request",
      "priority": "LOW",
      "inQueue": true,
      ...
    }
  ]
}
```

### Pull from Queue (CSR)
```http
PUT /api/issues/{issueId}/pull
Authorization: Bearer <token>
Role: CSR

Response (200):
{
  "success": true,
  "message": "Issue pulled from queue",
  "data": {
    "id": 3,
    "status": "IN_PROGRESS",
    "assignedCsrId": 2,
    "inQueue": false,
    ...
  }
}
```

### Get Assigned Issues (CSR)
```http
GET /api/issues/assigned
Authorization: Bearer <token>
Role: CSR

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "issueTitle": "Payment not received",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "customerName": "John Doe",
      ...
    }
  ]
}
```

### Update Issue Status (CSR)
```http
PUT /api/issues/{issueId}/status
Authorization: Bearer <token>
Role: CSR
Content-Type: application/json

{
  "status": "RESOLVED"
}

Valid statuses:
- IN_PROGRESS
- ACCEPTED
- RESOLVED
- REJECTED
- CLOSED

Response (200):
{
  "success": true,
  "message": "Status updated",
  "data": {
    "id": 1,
    "status": "RESOLVED",
    "resolvedAt": "2024-01-15T11:45:00",
    ...
  }
}
```

### Escalate Issue (CSR)
```http
PUT /api/issues/{issueId}/escalate
Authorization: Bearer <token>
Role: CSR
Content-Type: application/json

{
  "escalationReason": "Customer is upset, needs manager review"
}

Response (200):
{
  "success": true,
  "message": "Issue escalated",
  "data": {
    "id": 1,
    "status": "ESCALATED",
    "escalationReason": "Customer is upset, needs manager review",
    ...
  }
}
```

### Get Escalated Issues (Manager)
```http
GET /api/issues/escalated
Authorization: Bearer <token>
Role: MANAGER

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "issueTitle": "Payment not received",
      "status": "ESCALATED",
      "escalationReason": "Customer is upset...",
      "customerName": "John Doe",
      ...
    }
  ]
}
```

## ⭐ Feedback

### Submit Feedback (Customer)
```http
POST /api/feedback
Authorization: Bearer <token>
Role: CUSTOMER
Content-Type: application/json

{
  "issueId": 1,
  "rating": 4,
  "comment": "CSR was helpful and resolved quickly"
}

Response (200):
{
  "success": true,
  "message": "Feedback submitted",
  "data": {
    "id": 1,
    "issueId": 1,
    "issueTitle": "Payment not received",
    "customerId": 1,
    "customerName": "John Doe",
    "rating": 4,
    "comment": "CSR was helpful and resolved quickly",
    "createdAt": "2024-01-15T12:00:00"
  }
}
```

### Get All Feedbacks (Manager)
```http
GET /api/feedback
Authorization: Bearer <token>
Role: MANAGER

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "issueId": 1,
      "issueTitle": "Payment not received",
      "rating": 4,
      "comment": "CSR was helpful...",
      "customerName": "John Doe",
      ...
    }
  ]
}
```

## 📊 Analytics & Reports

### Get CSR Performance (Manager)
```http
GET /api/analytics/csr-performance
Authorization: Bearer <token>
Role: MANAGER

Response (200):
{
  "success": true,
  "data": [
    {
      "csrId": 2,
      "csrName": "Jane CSR",
      "csrEmail": "jane@example.com",
      "totalIssues": 15,
      "resolvedIssues": 12,
      "pendingIssues": 3,
      "escalationCount": 1,
      "avgResolutionTimeHours": 24.5,
      "avgFeedbackRating": 4.2
    }
  ]
}
```

### Get System Report (Manager)
```http
GET /api/reports
Authorization: Bearer <token>
Role: MANAGER

Response (200):
{
  "success": true,
  "data": {
    "issueStatusSummary": {
      "OPEN": 5,
      "IN_PROGRESS": 3,
      "ACCEPTED": 2,
      "RESOLVED": 20,
      "REJECTED": 1,
      "CLOSED": 15,
      "ESCALATED": 0
    },
    "csrPerformance": [
      {
        "csrId": 2,
        "csrName": "Jane CSR",
        "totalIssues": 15,
        "resolvedIssues": 12,
        ...
      }
    ],
    "overallAvgRating": 4.1,
    "totalIssues": 46,
    "totalResolved": 20,
    "totalEscalated": 0,
    "totalFeedbacks": 18
  }
}
```

## 👥 Users

### Get All CSRs (Manager)
```http
GET /api/users/csr
Authorization: Bearer <token>
Role: MANAGER

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 2,
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "CSR",
      "role": "CSR",
      "active": true,
      "createdAt": "2024-01-10T08:00:00"
    }
  ]
}
```

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email already registered: user@example.com"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Issue not found with id: 999"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An internal error occurred"
}
```

## 📋 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Server Error |

## 🔍 Query Parameters

### Filters (Future Enhancement)
```http
GET /api/issues/all?status=OPEN&priority=HIGH&page=1&size=10
```

## 📝 Issue Type Enum
- `COMPLAINT` - Customer complaint
- `SUGGESTION` - Feature/improvement suggestion
- `GOODWILL_SHARING` - Positive feedback/compliment

## 📊 Issue Status Enum
- `OPEN` - Newly created, waiting for assignment
- `IN_PROGRESS` - Assigned to CSR, being worked on
- `ACCEPTED` - CSR accepted the issue
- `RESOLVED` - Issue resolved by CSR
- `REJECTED` - CSR rejected the issue
- `CLOSED` - Issue closed after resolution
- `ESCALATED` - Escalated to manager for review

## 🎯 Priority Enum
- `LOW` - Low priority
- `MEDIUM` - Medium priority (default)
- `HIGH` - High priority (auto-detected for critical issues)

## 👤 Role Enum
- `CUSTOMER` - End user reporting issues
- `CSR` - Customer Service Representative
- `MANAGER` - System manager

## 📈 Rate Limiting
Currently no rate limiting implemented. Add for production deployment.

## 🔒 Security Notes
- Passwords never returned in API responses
- JWT tokens expire after 24 hours (configurable)
- All sensitive data validated and sanitized
- CORS enabled for frontend origin only

## 🚀 Example Workflows

### Complete Issue Resolution Workflow
```
1. POST /api/auth/login (Customer login)
2. POST /api/issues (Create issue)
3. POST /api/auth/login (Manager login)
4. PUT /api/issues/{id}/assign (Assign to CSR)
5. POST /api/auth/login (CSR login)
6. GET /api/issues/assigned (View assigned issues)
7. PUT /api/issues/{id}/status (Update to RESOLVED)
8. POST /api/auth/login (Customer login)
9. POST /api/feedback (Submit feedback)
10. POST /api/auth/login (Manager login)
11. GET /api/reports (View report with feedback)
```

---

For more details, see [README.md](README.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
