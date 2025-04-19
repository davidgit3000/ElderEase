from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from routes import users, medications, schedules, appointments, reminders
        #caregivers, clinics, clinic_patient_map
import os

app = FastAPI(title="ElderEase API")

# Load environment variables
#FRONTEND_URL = os.getenv("FRONTEND_URL")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
#app.include_router(user.router)
#app.include_router(trip.router)
#app.include_router(openai_route.router)
#app.include_router(webhook.router)

@app.get("/")
async def root():
    return {"message": "Welcome to ElderEase API"}