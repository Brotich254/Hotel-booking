# LuxStay — Hotel Booking System

Spring Boot (Java) + React + PostgreSQL.

## Stack
- Backend: Java 17, Spring Boot 3.2, Spring Security, JPA/Hibernate, JWT
- Frontend: React, Vite, Tailwind, date-fns
- Database: PostgreSQL

## Setup

### Prerequisites
- Java 17+, Maven
- PostgreSQL
- Node.js 18+

### Database
```bash
psql -U postgres -c "CREATE DATABASE hotel_booking;"
```

### Backend
```bash
cd backend
# Edit src/main/resources/application.properties with your DB credentials
mvn spring-boot:run
# Runs on port 8080, seeds 6 rooms automatically
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # runs on port 5173
```

### Admin Access
Set a user's role to 'ADMIN' directly in the DB:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Features
- Room search with availability check (date range, type, capacity)
- Real-time conflict detection — no double bookings
- Booking with total price calculation
- Cancel bookings
- Admin dashboard — all bookings, revenue stats
- JWT auth with role-based access (GUEST / ADMIN)
