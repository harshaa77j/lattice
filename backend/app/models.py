from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.database import Base


class Node(Base):
    __tablename__ = "nodes"

    id = Column(
        String,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    hostname = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="OFFLINE",
        nullable=False
    )

    cpu_cores = Column(
        Integer,
        nullable=False
    )

    ram_gb = Column(
        Integer,
        nullable=False
    )

    reliability = Column(
        Integer,
        default=100,
        nullable=False
    )

    active_lease = Column(
        Boolean,
        default=False,
        nullable=False
    )

    last_heartbeat = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )