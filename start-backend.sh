#!/bin/bash

# Start MySQL and Backend Service Script

echo "Starting Personal Finance Tracker Backend..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "MySQL is not running. Please start MySQL service first."
    echo "For macOS with Homebrew: brew services start mysql"
    echo "For Linux: sudo systemctl start mysql"
    echo "For Windows: Start MySQL service from Services panel"
    exit 1
fi

echo "MySQL is running..."

# Create database if it doesn't exist
echo "Setting up database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS finance_tracker;"

echo "Database setup completed."

# Build and run the Spring Boot application
echo "Building Spring Boot application..."
cd backend
./mvnw clean install

echo "Starting Spring Boot application..."
./mvnw spring-boot:run
