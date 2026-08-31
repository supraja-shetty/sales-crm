# Sales CRM – Proxima Assignment

A full-stack Sales CRM built for Option 1 of the Proxima Software Developer assignment.

## Stack
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Joi
- Frontend: React, Vite, React Router, Axios, Recharts
- No `models/` folder: MongoDB schemas/models are kept under `schemas/`.

## Features
- JWT admin/agent/user authentication
- Role-based access control
- Leads CRUD
- Contacts CRUD
- Deals CRUD
- Deal stages: New, In Progress, Won, Lost
- Dashboard KPIs and charts
- Search/filter/sort
- Activity logs
- Mock email/SMS notifications
- Pagination
- Validation and centralized error handling
- Responsive React dashboard

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

## Backend setup

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Linux/macOS:
```bash
cp .env.example .env
```

Backend runs on `http://localhost:5000`.

## Frontend setup

Open another terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Linux/macOS:
```bash
cp .env.example .env
```

Frontend runs on the Vite URL, normally `http://localhost:5173`.

## Default login

After running the seed:

- Email: `admin@crm.local`
- Password: `Admin@123`

The seed also creates sample leads, contacts and deals.

## Suggested technical-round demo

1. Login.
2. Show dashboard KPIs and charts.
3. Create a lead.
4. Search/filter leads.
5. Convert a lead to a contact.
6. Create a deal and move it through stages.
7. Show Won/Lost reporting.
8. Show activity logs.
9. Show role restrictions.
10. Explain JWT, validation, MongoDB schema design and API separation.

## API overview

### Auth
- POST `/api/auth/login`
- GET `/api/auth/me`

### Leads
- GET `/api/leads`
- GET `/api/leads/:id`
- POST `/api/leads`
- PUT `/api/leads/:id`
- DELETE `/api/leads/:id`
- POST `/api/leads/:id/convert`

### Contacts
- GET `/api/contacts`
- GET `/api/contacts/:id`
- POST `/api/contacts`
- PUT `/api/contacts/:id`
- DELETE `/api/contacts/:id`

### Deals
- GET `/api/deals`
- GET `/api/deals/:id`
- POST `/api/deals`
- PUT `/api/deals/:id`
- DELETE `/api/deals/:id`

### Dashboard
- GET `/api/dashboard/summary`

### Activity
- GET `/api/activity`

### Notifications
- GET `/api/notifications`

## Important

Deployment is optional for the assignment. The project is designed to run locally with frontend and backend on localhost.
