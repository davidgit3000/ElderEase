# ElderEase Backend (FastAPI)

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables for DB connection (see `.env.example`).
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Database
- Default uses PostgreSQL (compatible with NeonDB).
- Update `DATABASE_URL` in `.env` for production.

---

# ElderEase Frontend (React Native)

## Setup

1. Install dependencies:
   ```bash
   npm install -g expo-cli
   cd frontend
   npm install
   ```
2. Start the app:
   ```bash
   expo start
   ```

---

# Project Structure

- backend/   → FastAPI app
- frontend/  → React Native app
