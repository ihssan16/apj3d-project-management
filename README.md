# APJ3D Project Management System

## Stack
- Frontend: React.js, Recharts, jsPDF
- Backend: Node.js + Express
- Database: PostgreSQL

## Setup

### Backend
```bash
cd backend
npm install
# Configurer .env avec DATABASE_URL et JWT_SECRET
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Schema
[Inclure une image du diagramme DB ici]

## Performance Formula
Score = (Tasks Completed / Total Tasks) × 40
      + (Remaining Hours / Allocated Hours) × 40
      - (Breach Count × 10)
Clamped between 0 and 80.

Tags: Exceeding (≥60) | On Track (≥40) | Lagging (≥20) | Critical (<20)
