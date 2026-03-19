from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

import jwt

from config import settings

ALGORITHM = "HS256"
EXPIRE_DAYS = 7


@dataclass
class TokenData:
    user_id: int
    email: str


def create_token(user_id: int, email: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.now(UTC) + timedelta(days=EXPIRE_DAYS),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_token(token: str) -> TokenData:
    payload: dict[str, object] = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    return TokenData(user_id=int(str(payload["sub"])), email=str(payload["email"]))
