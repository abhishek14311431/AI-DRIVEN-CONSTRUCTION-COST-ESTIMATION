# Marker file for future expansion of detailed project entities
from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.base import Base

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
