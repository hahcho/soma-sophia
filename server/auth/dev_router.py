from fastapi import APIRouter
from fastapi.responses import RedirectResponse

from auth.jwt import create_token
from config import settings
from db.connection import SessionDep
from db.users import upsert_user

router = APIRouter(prefix="/auth", tags=["dev"])


@router.get("/dev-login")
async def dev_login(session: SessionDep, email: str = "dev@soma.local") -> RedirectResponse:
    user = await upsert_user(
        session,
        google_id=f"dev-{email}",
        email=email,
        name="Dev User",
        picture=None,
    )
    jwt_token = create_token(user.id, user.email)
    return RedirectResponse(f"{settings.frontend_url}/auth/callback?token={jwt_token}")
