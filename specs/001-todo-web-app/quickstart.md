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
Create a `.env` file in both `backend/` and `frontend/` roots:

**backend/.env**
```env
DATABASE_URL=postgres://...
AUTH_SECRET=your-secret
```

**frontend/.env**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
BETTER_AUTH_SECRET=your-secret
```

## Running Tests
- **Backend**: `pytest tests/`
- **Frontend**: `npm test`
