# Database Setup Guide

## Overview
The PayMyFees application now uses PostgreSQL database to store all student fee data, payment history, and receipts.

## Prerequisites
- PostgreSQL installed and running on your system
- Access to create databases and users

## Database Configuration

### 1. Create Database
Open PostgreSQL and run the following SQL:

```sql
CREATE DATABASE college_payment_db;
```

### 2. Create Database User (Optional)
If you want to use a specific user instead of the default postgres user:

```sql
CREATE USER college_user WITH PASSWORD 'your_password';
ALTER ROLE college_user WITH LOGIN;
GRANT ALL PRIVILEGES ON DATABASE college_payment_db TO college_user;
```

### 3. Update application.properties
The backend is configured in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/college_payment_db
spring.datasource.username=postgres
spring.datasource.password=1111
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Note:** Change username and password according to your PostgreSQL setup.

## Application Startup

When the application starts:

1. **Hibernate DDL-Auto**: Automatically creates all tables from entity classes
   - Table: `users` - Student and admin users
   - Table: `fees` - Fee breakdown for each student
   - Table: `payments` - Payment transaction history
   - Table: `receipts` - Payment receipts
   - Table: `student_profiles` - Extended student profile information

2. **DataInitializer**: Automatically populates sample data
   - Sample student user: `john_doe` (password: `password123`)
   - Sample fees: Academic Fee, Library Fee, Hostel/Transport, Exam Fee
   - Sample payment records with transaction history
   - Sample receipts

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(50)
);
```

### Fees Table
```sql
CREATE TABLE fees (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  label VARCHAR(255),
  amount NUMERIC(19,2),
  due_date DATE,
  status VARCHAR(50)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  transaction_id VARCHAR(255),
  payment_date DATE,
  amount NUMERIC(19,2),
  status VARCHAR(50),
  payment_method VARCHAR(100)
);
```

### Receipts Table
```sql
CREATE TABLE receipts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  receipt_id VARCHAR(255),
  receipt_date DATE,
  amount NUMERIC(19,2),
  payment_method VARCHAR(100),
  status VARCHAR(50)
);
```

### Student Profiles Table
```sql
CREATE TABLE student_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  student_id VARCHAR(255),
  enrollment_year VARCHAR(50),
  program VARCHAR(255),
  phone VARCHAR(20),
  address VARCHAR(500)
);
```

## Verifying the Setup

1. Start the backend application
2. Check logs for "✅ Sample data initialized successfully!" message
3. Connect to PostgreSQL:
   ```
   psql -d college_payment_db -U postgres
   ```

4. Query the data:
   ```sql
   SELECT * FROM users;
   SELECT * FROM fees WHERE user_id = (SELECT id FROM users WHERE username = 'john_doe');
   SELECT * FROM payments WHERE user_id = (SELECT id FROM users WHERE username = 'john_doe');
   SELECT * FROM receipts WHERE user_id = (SELECT id FROM users WHERE username = 'john_doe');
   SELECT * FROM student_profiles WHERE user_id = (SELECT id FROM users WHERE username = 'john_doe');
   ```

## Adding More Students

To add more student records, insert them directly into the database or create API endpoints for admin registration.

Example SQL:
```sql
INSERT INTO users (username, email, password, role) 
VALUES ('jane_smith', 'jane.smith@college.edu', 'password123', 'STUDENT');

INSERT INTO student_profiles (user_id, student_id, enrollment_year, program, phone, address)
VALUES (
  (SELECT id FROM users WHERE username = 'jane_smith'),
  'STU002',
  '2023',
  'Mechanical Engineering',
  '+1-555-0124',
  '456 Oak Ave, College City, State 12345'
);

INSERT INTO fees (user_id, label, amount, due_date, status)
VALUES 
  ((SELECT id FROM users WHERE username = 'jane_smith'), 'Academic Fee', 3000, '2024-09-30', 'PAID'),
  ((SELECT id FROM users WHERE username = 'jane_smith'), 'Library Fee', 500, '2024-10-15', 'PENDING'),
  ((SELECT id FROM users WHERE username = 'jane_smith'), 'Hostel/Transport', 1000, '2024-08-31', 'PENDING'),
  ((SELECT id FROM users WHERE username = 'jane_smith'), 'Exam Fee', 500, '2024-11-30', 'PENDING');
```

## Frontend Login

The frontend now fetches all real data from the database:

**Test Login:**
- Username: `john_doe`
- Password: `password123`

After login, all fees, payments, receipts, and profile data are fetched from the database in real-time.

## API Endpoints

All endpoints now return real database data:

- `GET /api/auth/user/{username}` - Get user details
- `GET /api/fees/{username}` - Get fee summary with breakdown
- `GET /api/fees/history/{username}` - Get payment transaction history
- `GET /api/fees/receipts/{username}` - Get payment receipts
- `GET /api/fees/profile/{username}` - Get student profile

## Notes

- The `spring.jpa.hibernate.ddl-auto=update` setting auto-creates/updates tables. Change to `validate` in production.
- Passwords are currently stored in plain text. Implement BCrypt encryption in production.
- The DataInitializer runs automatically on startup and skips if data already exists.
