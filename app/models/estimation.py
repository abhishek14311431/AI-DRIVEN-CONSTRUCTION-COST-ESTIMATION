# Marker file for future expansion of granular estimation records
from sqlalchemy import Column, Integer, Float, ForeignKey
from app.database.base import Base

class Estimation(Base):
    __tablename__ = "estimations"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    total_cost = Column(Float)
