import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.routes import crops, mandis, prices, analysis, alerts, voice, health

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FARM2MARKET API",
    description="Intelligent, multilingual agricultural market decision-support backend",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(crops.router)
app.include_router(mandis.router)
app.include_router(prices.router)
app.include_router(analysis.router)
app.include_router(alerts.router)
app.include_router(voice.router)
app.include_router(health.router)

@app.get("/")
def root():
    return {
        "app": "FARM2MARKET",
        "tagline": "See the price before you sell.",
        "problem_statement": "PS-A02 — Selling Blind",
        "docs_url": "/docs"
    }
