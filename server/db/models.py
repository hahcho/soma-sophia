from dataclasses import dataclass, field
from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Integer, String, Table, func
from sqlalchemy.orm import registry

mapper_registry = registry()
metadata = mapper_registry.metadata


@dataclass
class User:
    google_id: str
    email: str
    name: str
    picture: str | None = None
    id: int = field(default=0, init=False)
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC), init=False)


users_table = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("google_id", String, nullable=False, unique=True),
    Column("email", String, nullable=False, unique=True),
    Column("name", String, nullable=False),
    Column("picture", String, nullable=True),
    Column("created_at", DateTime(timezone=True), server_default=func.now(), nullable=False),
)

mapper_registry.map_imperatively(User, users_table)
