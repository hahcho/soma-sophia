from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import User, users_table


async def upsert_user(
    session: AsyncSession,
    *,
    google_id: str,
    email: str,
    name: str,
    picture: str | None,
) -> User:
    result = await session.execute(select(User).where(users_table.c.google_id == google_id))
    user: User | None = result.scalars().first()
    if user is None:
        user = User(google_id=google_id, email=email, name=name, picture=picture)
        session.add(user)
        await session.flush()
    else:
        user.email = email
        user.name = name
        user.picture = picture
    return user


async def get_user_by_id(session: AsyncSession, user_id: int) -> User | None:
    return await session.get(User, user_id)
