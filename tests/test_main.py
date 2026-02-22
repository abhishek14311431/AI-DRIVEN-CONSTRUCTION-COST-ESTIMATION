import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.base import Base

# Setup SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Construction AI Cost Estimation API is running"}

def test_own_house_estimate_basic():
    payload = {
        "floor": "G+1",
        "bedrooms": 3,
        "structural_style": "Base",
        "zone": "C",
        "lift": False,
        "interior_type": "None",
        "include_compound_wall": False,
        "include_rainwater_harvesting": False
    }
    response = client.post("/api/v1/own-house/estimate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_cost"] == 6300000.0
    assert "breakdown" in data

def test_own_house_validation_bedrooms():
    # G+1 requires 3 bedrooms, sending 2 should fail
    payload = {
        "floor": "G+1",
        "bedrooms": 2,
        "structural_style": "Base",
        "zone": "C"
    }
    response = client.post("/api/v1/own-house/estimate", json=payload)
    assert response.status_code == 400
    assert "Minimum 3 bedrooms required" in response.json()["detail"]

def test_own_house_extra_bedrooms():
    # G+1 base is 63L. 4 bedrooms = 63L + 2.5L = 65.5L
    payload = {
        "floor": "G+1",
        "bedrooms": 4,
        "structural_style": "Base",
        "zone": "C"
    }
    response = client.post("/api/v1/own-house/estimate", json=payload)
    assert response.status_code == 200
    assert response.json()["total_cost"] == 6550000.0

def test_own_house_optional_utilities():
    # G+1 base (63L) + Compound Wall (2.8L) + Rainwater (75k) = 66,55,000
    payload = {
        "floor": "G+1",
        "bedrooms": 3,
        "structural_style": "Base",
        "zone": "C",
        "include_compound_wall": True,
        "include_rainwater_harvesting": True
    }
    response = client.post("/api/v1/own-house/estimate", json=payload)
    assert response.status_code == 200
    assert response.json()["total_cost"] == 6655000.0
    assert response.json()["breakdown"]["Compound Wall"] == 280000
    assert response.json()["breakdown"]["Rainwater Harvesting"] == 75000

def test_rental_estimate():
    # RENTAL_BASE (38L) * G+1 (0.6) = 22.8L
    payload = {
        "floor": "G+1",
        "upgrade_level": "Base",
        "zone": "C"
    }
    response = client.post("/api/v1/rental/estimate", json=payload)
    assert response.status_code == 200
    assert response.json()["total_cost"] == 2280000.0

def test_commercial_estimate_lift_mandatory():
    # G+3 requires lift
    payload = {
        "total_sqft": 1000,
        "floors": 4,
        "zone": "C",
        "lift_required": False
    }
    response = client.post("/api/v1/commercial/estimate", json=payload)
    assert response.status_code == 200
    # Base: 1000 * 2500 = 2.5M
    # Fire: 1000 * 150 = 150k
    # Elec: 1000 * 250 = 250k
    # Total Construction: 2.9M
    # Lift: 1.5M
    # Total: 4.4M
    assert response.json()["total_cost"] == 4400000.0

def test_interior_estimate():
    # 1000 sqft * Semi (1200) = 1.2M
    payload = {
        "total_sqft": 1000,
        "style": "Semi"
    }
    response = client.post("/api/v1/interior/estimate", json=payload)
    assert response.status_code == 200
    assert response.json()["total_cost"] == 1200000.0
