from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EstimationRequest(BaseModel):
    dimensions: str
    bedrooms: int
    upgrades: list = []

@app.post("/api/v1/own-house/estimate")
async def estimate(data: EstimationRequest):
    # Dummy cost calculation
    base_cost = 100000
    upgrade_cost = 5000 * len(data.upgrades)
    total_cost = base_cost + upgrade_cost
    return {
        "base_cost": base_cost,
        "upgrade_cost": upgrade_cost,
        "total_cost": total_cost,
        "breakdown": {
            "base": base_cost,
            "upgrades": upgrade_cost
        }
    }

@app.get("/")
async def root():
    return {"message": "AI-Driven Construction Cost Estimation API is running."}
