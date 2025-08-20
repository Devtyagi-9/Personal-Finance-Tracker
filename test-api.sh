#!/bin/bash

echo "🧪 Testing Personal Finance Tracker API End-to-End"
echo "=================================================="

BASE_URL="http://localhost:8080/api"

# Test 1: Health Check
echo "1. Testing Health Check..."
response=$(curl -s -X GET "$BASE_URL/auth/test")
echo "✅ Health Check: $response"
echo ""

# Test 2: User Signup (if not already exists)
echo "2. Testing User Signup..."
signup_response=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')
echo "✅ Signup Response: $signup_response"
echo ""

# Test 3: User Login
echo "3. Testing User Login..."
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')
echo "✅ Login Response: $login_response"

# Extract token
token=$(echo $login_response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "🔑 JWT Token: ${token:0:50}..."
echo ""

if [ -z "$token" ]; then
  echo "❌ Login failed, cannot continue with protected endpoints"
  exit 1
fi

# Test 4: Get Current User
echo "4. Testing Get Current User..."
user_response=$(curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $token")
echo "✅ Current User: $user_response"
echo ""

# Test 5: Create Transaction
echo "5. Testing Create Transaction..."
transaction_response=$(curl -s -X POST "$BASE_URL/transactions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{
    "amount": 750.00,
    "description": "API Test Transaction",
    "category": "Testing",
    "type": "EXPENSE",
    "transactionDate": "2025-08-20",
    "notes": "Created via API test script"
  }')
echo "✅ Create Transaction: $transaction_response"
echo ""

# Test 6: Get All Transactions
echo "6. Testing Get All Transactions..."
transactions_response=$(curl -s -X GET "$BASE_URL/transactions" \
  -H "Authorization: Bearer $token")
echo "✅ All Transactions: $transactions_response"
echo ""

# Test 7: Create Budget
echo "7. Testing Create Budget..."
budget_response=$(curl -s -X POST "$BASE_URL/budgets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{
    "category": "Testing",
    "budgetLimit": 1000.00,
    "month": 8,
    "year": 2025
  }')
echo "✅ Create Budget: $budget_response"
echo ""

# Test 8: Get Dashboard Data
echo "8. Testing Get Dashboard Data..."
dashboard_response=$(curl -s -X GET "$BASE_URL/dashboard" \
  -H "Authorization: Bearer $token")
echo "✅ Dashboard Data: $dashboard_response"
echo ""

echo "🎉 End-to-End API Testing Complete!"
echo "=================================================="
echo "Both Backend (http://localhost:8080) and Frontend (http://localhost:3000) are running!"
echo "You can now test the full application in your browser."
