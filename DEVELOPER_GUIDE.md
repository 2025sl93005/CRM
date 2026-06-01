# ResolveAI - Developer Guide

Quick reference for developers working with ResolveAI CRM.

## 🛠️ Development Environment Setup

### First-Time Setup (5 minutes)

1. **Clone/Copy Project**
   ```bash
   # Navigate to project root
   cd /Users/I578356/Desktop/CRM
   ```

2. **Backend Setup**
   ```bash
   cd resolveai-backend
   
   # Update application.properties with your credentials
   # Then build and run
   mvn clean install
   mvn spring-boot:run
   # Runs on http://localhost:8080
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd ../resolveai-frontend
   npm install
   npm run dev
   # Runs on http://localhost:5173
   ```

4. **Database Setup**
   ```bash
   mysql -u root -p < schema.sql
   # Creates resolveai_crm database with tables
   ```

## 📁 Code Organization

### Backend Structure
```
controller/  → Receives HTTP requests, validates, returns JSON
    ↓
service/     → Business logic, calculations, workflows
    ↓
repository/  → Database queries, JPA operations
    ↓
entity/      → Database table representations
    ↓
database/    → MySQL tables
```

### Frontend Structure
```
App.jsx      → Router setup
    ↓
pages/       → Full page components
    ↓
components/  → Reusable components
    ↓
api/         → API calls to backend
    ↓
context/     → Global state (auth, theme)
```

## 🔍 Common Development Tasks

### Add New API Endpoint

1. **Create DTO** (if needed)
   ```java
   // dto/MyNewRequest.java
   @Data
   public class MyNewRequest {
       @NotBlank
       private String field;
   }
   ```

2. **Create Service Method**
   ```java
   // service/MyService.java
   public MyResponse doSomething(MyNewRequest req) {
       // Business logic
       return response;
   }
   ```

3. **Add Controller Method**
   ```java
   // controller/MyController.java
   @PostMapping("/my-endpoint")
   @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<ApiResponse<MyResponse>> myEndpoint(
       @Valid @RequestBody MyNewRequest request) {
       return ResponseEntity.ok(ApiResponse.ok(myService.doSomething(request)));
   }
   ```

4. **Add API Function** (Frontend)
   ```javascript
   // api/endpoints.js
   export const myNewEndpoint = (data) => api.post('/my-endpoint', data)
   ```

5. **Call from Component** (Frontend)
   ```jsx
   import { myNewEndpoint } from '../../api/endpoints'
   
   const handleClick = async () => {
       try {
           const res = await myNewEndpoint({ field: 'value' })
           setData(res.data.data)
       } catch (err) {
           toast.error('Error')
       }
   }
   ```

### Add New Page/Role

1. **Create New Page Component**
   ```jsx
   // src/pages/newrole/NewPage.jsx
   export default function NewPage() {
       return <div>Content</div>
   }
   ```

2. **Add Route in App.jsx**
   ```jsx
   <Route path="/newrole/page" 
       element={<ProtectedRoute roles={['NEWROLE']}><NewPage /></ProtectedRoute>} />
   ```

3. **Add Navigation Link** (Navbar.jsx)
   ```jsx
   const navLinks = {
       NEWROLE: [
           { to: '/newrole/page', label: 'Page' },
       ]
   }
   ```

### Add Database Field

1. **Update Entity**
   ```java
   @Column(nullable = false)
   private String newField;
   ```

2. **Create Migration** (or use ddl-auto: update)
   ```sql
   ALTER TABLE issues ADD COLUMN new_field VARCHAR(255);
   ```

3. **Update DTO**
   ```java
   private String newField;
   ```

4. **Handle in Service** (if needed)
   ```java
   issue.setNewField(request.getNewField());
   ```

## 🐛 Debugging Tips

### Backend Debug

1. **Check Logs**
   ```bash
   # Terminal will show Spring Boot logs
   # Look for ERROR, WARN messages
   ```

2. **Add Breakpoints** (IDE)
   - Click line number in IDE
   - Run with Maven in debug mode
   - VS Code: Use Java Debugger Extension

3. **Check Database**
   ```sql
   mysql -u root -p
   USE resolveai_crm;
   SELECT * FROM issues;
   ```

### Frontend Debug

1. **Browser DevTools**
   - F12 to open
   - Network tab: Check API requests
   - Console tab: Check for JS errors
   - Application tab: Check localStorage

2. **React DevTools Extension**
   - Install from Chrome Web Store
   - Inspect components
   - Check props/state

3. **Add console.log**
   ```jsx
   console.log('Value:', value)
   ```

## 📝 Code Style Guide

### Java Style
```java
// ✅ Good
private String getUserName(User user) {
    return user.getFirstName() + " " + user.getLastName();
}

// ❌ Bad
private String gUN(User u) {
    return u.fn + " " + u.ln;
}
```

### React Style
```jsx
// ✅ Good
const [issues, setIssues] = useState([])
const handleUpdate = async (id) => { ... }

// ❌ Bad
const [s, setS] = useState([])
const h = async (i) => { ... }
```

### SQL Naming
```
✅ users, issues, created_at
❌ user_tbl, tblIssue, createdAt
```

## 🧪 Testing Your Changes

### Backend Test
```bash
# Test endpoint with curl
curl -X GET http://localhost:8080/api/issues/all \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Frontend Test
1. Open http://localhost:5173
2. Test UI flow
3. Check browser console for errors
4. Verify data appears correctly

## 🔐 Security Checklist

- ✅ All endpoints have @PreAuthorize
- ✅ User email validated
- ✅ Password encrypted (BCrypt)
- ✅ JWT token required for protected endpoints
- ✅ CORS configured for frontend origin
- ✅ SQL injection protected (JPA)
- ✅ No sensitive data in logs

## 📊 Performance Tips

### Database
- Add indexes for frequently queried columns (already done)
- Use pagination for large result sets
- Lazy load relationships

### Backend
- Use @Transactional for multi-step operations
- Cache frequently accessed data
- Use async for email sending (already implemented)

### Frontend
- Lazy load routes (React.lazy)
- Memoize expensive components
- Optimize re-renders

## 🚀 Deployment Checklist

### Before Production
- [ ] Update JWT secret (long random string)
- [ ] Configure production database
- [ ] Set production SMTP settings
- [ ] Update CORS allowed origins
- [ ] Review security settings
- [ ] Enable HTTPS
- [ ] Set ddl-auto to "validate"
- [ ] Run all tests
- [ ] Review error logs

### Production Commands
```bash
# Backend
java -jar target/crm-1.0.0.jar \
  --spring.datasource.url=jdbc:mysql://prod-db:3306/crm \
  --spring.datasource.username=produser \
  --spring.datasource.password=strongpass

# Frontend - Build & Serve
npm run build
# Deploy dist/ folder to web server
```

## 📚 Useful Resources

### Backend
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io)

### Frontend
- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [TailwindCSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)

### Tools
- [Postman](https://www.postman.com) - API testing
- [MySQL Workbench](https://www.mysql.com/products/workbench) - Database client
- [VS Code](https://code.visualstudio.com) - Code editor
- [Git](https://git-scm.com) - Version control

## 🔧 Useful Commands

### Maven
```bash
mvn clean                # Clean build
mvn compile             # Compile
mvn test                # Run tests
mvn package             # Create JAR
mvn spring-boot:run     # Run app
```

### NPM
```bash
npm install             # Install dependencies
npm start               # Start (alias to dev)
npm run dev             # Dev server
npm run build           # Production build
npm run preview         # Preview build
npm run lint            # Run ESLint
```

### Git
```bash
git clone <url>         # Clone
git add .               # Stage changes
git commit -m "msg"     # Commit
git push                # Push to remote
git pull                # Fetch & merge
```

### MySQL
```bash
mysql -u root -p        # Connect
SHOW DATABASES;         # List DBs
USE resolveai_crm;      # Select DB
SHOW TABLES;            # List tables
SELECT * FROM users;    # Query
```

## 💡 Pro Tips

1. **Use .env files** to manage environment variables
2. **Commit frequently** with clear messages
3. **Write comments** for complex logic
4. **Test before committing** to avoid breaking changes
5. **Use feature branches** for new features
6. **Code review** before merging
7. **Keep API backwards compatible** when possible
8. **Monitor logs** in production

## 🎯 Next Steps After Setup

1. **Understand the Architecture** - Read ARCHITECTURE.md
2. **Explore the Code** - Read through main services
3. **Test User Flows** - Log in as different roles
4. **Make a Small Change** - Add a field or button
5. **Deploy Locally** - Set up on another machine
6. **Extend Features** - Add new functionality

---

**Happy coding! Feel free to customize and extend the system.** 🚀
