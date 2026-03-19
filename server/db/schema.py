from db.connection import engine
from db.models import metadata


async def init_schema() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(metadata.create_all)
