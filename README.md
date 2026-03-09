# Inventory Management System

A backend-based inventory management system built using Node.js and PostgreSQL.  
The system manages products, inventory stock, and transaction records using RESTful APIs.

## Tech Stack
- Node.js
- Express.js
- PostgreSQL

## Project Structure

config/        - Database configuration  
controllers/   - Business logic for API endpoints  
middleware/    - Authentication and request middleware  
routes/        - API route definitions  
server.js      - Application entry point  

## Installation

1. Clone the repository

git clone <repo-link>

2. Install dependencies

npm install

3. Create a `.env` file

DB_HOST=  
DB_PORT=  
DB_USER=  
DB_PASSWORD=  
DB_NAME=

4. Run the server

node server.js