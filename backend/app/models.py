from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    date = Column(String, nullable=False)  # ISO 8601
    duration = Column(Integer, nullable=False)  # seconds
    participants = Column(JSON, nullable=False)  # list of names
    summary = Column(Text, nullable=True)
    key_topics = Column(JSON, nullable=True)  # list of topic strings
    meeting_type = Column(String, default="general")  # sales, standup, interview, general
    tags = Column(JSON, nullable=True)  # list of tag strings
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    transcript_segments = relationship(
        "TranscriptSegment", back_populates="meeting", cascade="all, delete-orphan"
    )
    action_items = relationship(
        "ActionItem", back_populates="meeting", cascade="all, delete-orphan"
    )


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    speaker = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    start_time = Column(Float, nullable=False)  # seconds from meeting start
    end_time = Column(Float, nullable=False)
    segment_order = Column(Integer, nullable=False)

    meeting = relationship("Meeting", back_populates="transcript_segments")


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    assignee = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    due_date = Column(String, nullable=True)
    created_at = Column(String, nullable=False)

    meeting = relationship("Meeting", back_populates="action_items")
