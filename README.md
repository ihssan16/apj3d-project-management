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
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Database Schema

### 9 Core Entities:
- **Project** → id, project_code, name, client, type, status, total_hours, budget, start_date, end_date
- **Estimation** → id, project_id, est_hours, hourly_rate, quoted_price, approval_status
- **TeamMember** → id, name, email, role, department
- **ProjectAssignment** → id, project_id, member_id, allocated_hours, hours_used
- **Task** → id, project_id, assigned_to, title, est_hours, logged_hours, deadline, status, parent_task_id
- **TimeLog** → id, task_id, member_id, date, hours_logged, notes
- **BreachLog** → id, task_id, member_id, original_deadline, revised_deadline, reason
- **PerformanceRecord** → id, member_id, project_id, score, status_tag, computed_at
- **ProjectDelivery** → id, project_id, delivery_date, mode, client_signoff, notes

## Performance Formula
Score = (Tasks Completed / Total Tasks) × 40
      + (Remaining Hours / Allocated Hours) × 40
      - (Breach Count × 10)
Clamped between 0 and 80.

Tags: Exceeding (≥60) | On Track (≥40) | Lagging (≥20) | Critical (<20)

## Reports Available
- Project Summary Report (hours budgeted vs used)
- Per-Member Performance Report
- Lag Attribution Report (traceable to person + task)
- PDF and CSV export functional

## Screenshots
<img width="953" height="471" alt="Capture d&#39;écran 2026-06-25 104515" src="https://github.com/user-attachments/assets/968b7a58-5731-4165-afc2-db27adaca5b5" />
<img width="956" height="502" alt="Capture d&#39;écran 2026-06-25 104712" src="https://github.com/user-attachments/assets/9d627ac7-5d71-47e4-bebd-fd09d220965b" />
<img width="959" height="497" alt="Capture d&#39;écran 2026-06-25 104739" src="https://github.com/user-attachments/assets/c31adaa2-6410-4a9d-a5ed-6173df3f235c" />

