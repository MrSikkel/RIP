from sqlalchemy import Column, Integer, String, DateTime
from .database import Base
from datetime import datetime

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String, index=True)
    title = Column(String, index=True)
    text = Column(String, index=True)
    created_at = Column(DateTime, default = datetime.utcnow)
