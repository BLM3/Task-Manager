from sqlalchemy import Column, Integer, String, Boolean, DateTime,Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__="users"
    id = Column(Integer, primary_key=True, index=True)
    email= Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    priority = Column(String, default="medium", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    due_date = Column(Date, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="tasks")