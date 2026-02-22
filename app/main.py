from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import (
    own_house, rental, villa, commercial, interior, exterior, projects
)
from app.core.config import settings
from app.database import base
from app.database.session import engine

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    base.Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(own_house.router, prefix=f"{settings.API_V1_STR}/own-house", tags=["Own House"])
app.include_router(rental.router, prefix=f"{settings.API_V1_STR}/rental", tags=["Rental"])
app.include_router(villa.router, prefix=f"{settings.API_V1_STR}/villa", tags=["Villa"])
app.include_router(commercial.router, prefix=f"{settings.API_V1_STR}/commercial", tags=["Commercial"])
app.include_router(interior.router, prefix=f"{settings.API_V1_STR}/interior", tags=["Interior"])
app.include_router(exterior.router, prefix=f"{settings.API_V1_STR}/exterior", tags=["Exterior"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["Projects"])

@app.get("/")
def root():
    return {"message": "Construction AI Cost Estimation API is running"}
