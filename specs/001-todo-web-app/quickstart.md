# Quickstart: Phase II - Todo Full-Stack Web Application

## Development Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 20+
- Neon PostgreSQL connection string (NEON_DATABASE_URL)

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m src.main
```
API will be available at `http://localhost:8000`.

### 3. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Web application will be available at `http://localhost:3000`.

### 4. Environment Variables
Create a `.env.local` file in `frontend/` and `.env` in `backend/`:

**backend/.env**
```env
DATABASE_URL=postgres://user:password@hostname/dbname?sslmode=require
# Shared secret for extracting user info from session in middleware
SHARED_AUTH_SECRET=your-secure-shared-secret
```

**frontend/.env.local**
```env
# Better Auth setup
BETTER_AUTH_SECRET=your-secure-shared-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Backend API proxy or direct URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Running the App
1. Start the FastAPI backend: `cd backend && python -m src.main`
2. Start the Next.js frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000` in your browser.

