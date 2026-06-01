# Issue Detail View with Live Timeline & Discussion

## Overview
This feature adds a comprehensive Issue Detail View that enables real-time collaboration between customers, CSRs, and managers. It provides transparency, communication tracking, and complete audit history for each support ticket.

## Features Implemented

### 1. **Issue Header**
Displays complete issue information:
- **Ticket ID**: Auto-generated (TICKET-XXX format)
- **Title & Description**: Full issue details
- **Type & Priority**: Color-coded badges
- **Customer Information**: Who created the issue
- **Timestamps**: Creation and last update time

### 2. **Live Status Tracker**
Visual representation of issue lifecycle:
```
✅ OPEN
✅ ASSIGNED
✅ IN_PROGRESS
🟠 ESCALATED (current)
⬜ RESOLVED
⬜ CLOSED
```
Shows current status visually with progress indicators.

### 3. **Assigned CSR Section**
Right sidebar showing:
- **CSR Name & Email**: Who is handling the issue
- **Status**: Assigned or Unassigned
- **Assignment Date**: When it was assigned
- Quick reference for contacting the CSR

### 4. **Discussion Thread (Most Important)**
Real-time comment system with:
- **User Comments**: Displayed with user info, role, and timestamp
- **Role-based Colors**: 
  - 🔵 CUSTOMER (Blue)
  - 🟢 CSR (Green)
  - 🟣 MANAGER (Purple)
- **Chronological Order**: Comments organized by time
- **Comment Submission**: Easy-to-use message input
- **Visibility Rules**:
  - Customers can see: their own comments, CSR comments, manager comments
  - CSRs can see: assigned issue comments, customer comments, manager comments
  - Managers can see: all comments on all issues

### 5. **Activity Timeline**
System-generated audit log showing:
- **Issue Created**: 📝 When ticket was created
- **Assigned**: 👤 CSR assignment details
- **Status Updated**: 🔄 Status changes with timestamps
- **Escalated**: ⬆️ Escalation events
- **Resolved**: ✅ Resolution details
- **Comments Added**: 💬 Comment activity
- **Closed**: 🔒 Closure details

Each activity shows:
- Action type and description
- Who performed the action
- User role and email
- Exact timestamp

## Database Schema

### Comments Table
```sql
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    message LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_issue_id (issue_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Activity Log Table
```sql
CREATE TABLE IF NOT EXISTS issue_activity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_description LONGTEXT NOT NULL,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_issue_id (issue_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Backend Implementation

### New Entities
- **IssueComment.java**: Represents a user comment on an issue
- **IssueActivity.java**: Represents a system activity/audit log entry

### New Services
- **CommentService.java**: Handles comment CRUD operations and access control
- **ActivityService.java**: Logs and retrieves activity timeline

### New Repositories
- **IssueCommentRepository.java**: Data access for comments
- **IssueActivityRepository.java**: Data access for activities

### New DTOs
- **CommentDto.java**: Comment response DTO
- **ActivityDto.java**: Activity response DTO
- **CreateCommentRequest.java**: Comment creation request
- **DetailedIssueDto.java**: Complete issue with comments and activities

### New Controllers
- **CommentController.java**: REST endpoints for comments
  - POST `/api/comments` - Add comment
  - GET `/api/comments/issue/{issueId}` - Get comments
  - DELETE `/api/comments/{commentId}` - Delete comment

- **ActivityController.java**: REST endpoints for activities
  - GET `/api/activities/issue/{issueId}` - Get activity timeline

### Updated Controllers
- **IssueController.java**: Added new endpoint
  - GET `/api/issues/{id}/detail` - Get detailed issue view with comments & activities

## Frontend Implementation

### New Components
1. **IssueDetail.jsx** - Main detail page layout (3-column grid)
2. **IssueHeader.jsx** - Issue information header
3. **StatusTracker.jsx** - Visual status progression
4. **AssignedCsrSection.jsx** - CSR information sidebar
5. **CommentsThread.jsx** - Comment discussion interface
6. **ActivityTimeline.jsx** - System activity log

### Routes
- **GET** `/issue/:id/detail` - Issue detail view (accessible to CUSTOMER, CSR, MANAGER)

### Updated Pages
- **MyIssues.jsx** - Added click handlers to navigate to issue detail view

## API Endpoints

### Comments
```
POST   /api/comments
       Request: { issueId, message }
       Response: { success, data: CommentDto }

GET    /api/comments/issue/{issueId}
       Response: { success, data: [CommentDto] }

DELETE /api/comments/{commentId}
       Response: { success }
```

### Activities
```
GET    /api/activities/issue/{issueId}
       Response: { success, data: [ActivityDto] }
```

### Issues
```
GET    /api/issues/{id}/detail
       Response: { success, data: DetailedIssueDto }
       (Includes: issue, comments, activities, commentCount)
```

## Access Control

### By Role

**CUSTOMER**
- ✅ View own issue detail
- ✅ Add comments to own issues
- ✅ See CSR and manager comments
- ✅ View activity timeline
- ❌ View other customers' issues
- ❌ Delete others' comments

**CSR**
- ✅ View assigned issue detail
- ✅ Add comments to assigned issues
- ✅ See customer and manager comments
- ✅ View activity timeline
- ❌ View unassigned issues
- ❌ View other CSRs' assigned issues

**MANAGER**
- ✅ View all issue details
- ✅ Add comments to any issue
- ✅ See all comments on all issues
- ✅ View activity timeline for any issue
- ✅ Delete any comment if needed

## User Flows

### Customer Flow
1. Customer login
2. Navigate to "My Issues"
3. Click on an issue row
4. View issue detail with:
   - Full issue information
   - Status progression
   - CSR assigned to issue
   - Discussion with CSR and manager
   - Complete activity history
5. Add comments to communicate with CSR
6. Track status changes in real-time

### CSR Flow
1. CSR login
2. Navigate to "Assigned Issues" or "Queue"
3. Click on an issue
4. View customer's original request
5. See all previous comments and interactions
6. Add comments to update customer
7. Update status as they work on the issue
8. Escalate if needed (manager will see activity)

### Manager Flow
1. Manager login
2. Navigate to "All Issues", "Escalated Issues", or "Reports"
3. Click on any issue
4. View complete history (all comments, activities)
5. Monitor team communication
6. Add guidance or comments to issues
7. Verify CSR work and customer satisfaction

## Testing Guide

### Test Comment Submission
1. Navigate to any issue detail page
2. Scroll to "Discussion Thread" section
3. Type a message in the comment box
4. Click "Send Comment"
5. Verify comment appears immediately with your name, email, role, and timestamp

### Test Activity Tracking
1. Open an issue detail page
2. Scroll to "Activity Timeline" section
3. Verify all major events are recorded:
   - Issue creation
   - Assignment to CSR
   - Status updates
   - Comments added
   - Escalations

### Test Role-based Access
1. Create a test issue as customer
2. Have CSR view the issue and add comment
3. Have manager view and add comment
4. Verify role badges are displayed correctly
5. Test that unauthorized users cannot view issue details

### Test Comment Visibility
1. Add comment as customer
2. Switch to CSR account and verify visibility
3. Switch to manager and verify visibility
4. Verify customers cannot see comments from other customers

## Future Enhancements

1. **Real-time Updates**: WebSocket support for live comment updates
2. **Attachment Support**: Allow file uploads in comments
3. **Comment Editing**: Allow users to edit their own comments
4. **Mention System**: @mention other users in comments
5. **Typing Indicators**: Show when someone is typing
6. **Read Receipts**: Track who has read the comments
7. **Email Notifications**: Notify users when new comments are added
8. **Search**: Search across comments and activities
9. **Export**: Export issue details with full history as PDF
10. **Reactions**: Emoji reactions to comments

## Performance Considerations

1. **Indexed Queries**: All comment and activity queries are indexed by issue_id
2. **Pagination**: Consider adding pagination for issues with many comments
3. **Lazy Loading**: Activities and comments load on demand
4. **Caching**: Manager can cache frequently viewed issues

## Security

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Role-based access control enforced
3. **SQL Injection**: Parameterized queries prevent injection attacks
4. **XSS Protection**: Frontend escapes all user input
5. **Soft Deletes**: Consider implementing soft deletes for audit compliance

---

**Feature Status**: ✅ Implemented and Ready for Testing
**Branches**: `enhancements`
**Date Added**: June 1, 2026
