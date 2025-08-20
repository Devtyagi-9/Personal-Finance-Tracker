# Quick Start Guide

## Option 1: Docker Setup (Recommended - Easiest)

1. **Prerequisites**: Install Docker and Docker Compose
2. **Start the application**:
   ```bash
   docker-compose up --build
   ```
3. **Access**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## Option 2: Manual Setup

### Backend Setup
1. **Install Java 17+ and MySQL**
2. **Create database**:
   ```sql
   mysql -u root -p
   CREATE DATABASE finance_tracker;
   ```
3. **Update database password** in `backend/src/main/resources/application.properties`
4. **Run backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. **Install Node.js 18+**
2. **Install dependencies and run**:
   ```bash
   npm install
   npm run dev
   ```

## Quick Test
1. **Register a new user** at http://localhost:5173
2. **Add some transactions** using the dashboard
3. **Set budgets** for different categories
4. **View analytics** on the dashboard

## Default Configuration
- Backend runs on port 8080
- Frontend runs on port 5173
- MySQL runs on port 3306
- Database name: finance_tracker
- Default MySQL credentials: root/password (change in application.properties)

## Troubleshooting
- **Database connection error**: Check MySQL is running and credentials are correct
- **CORS error**: Ensure frontend URL is allowed in backend CORS configuration
- **Port conflicts**: Change ports in application.properties or docker-compose.yml if needed
