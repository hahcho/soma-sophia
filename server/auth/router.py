from typing import Any, cast

from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from starlette.requests import Request

from auth.dependencies import get_current_user
from auth.jwt import create_token
from config import settings
from db.connection import SessionDep
from db.users import User, upsert_user

router = APIRouter(prefix="/auth", tags=["auth"])

oauth: Any = OAuth()
oauth.register(
    name="google",
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


@router.get("/login")
async def login(request: Request) -> RedirectResponse:
    redirect_uri = request.url_for("callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback", name="callback")
async def callback(request: Request, session: SessionDep) -> RedirectResponse:
    try:
        token: Any = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    userinfo = cast(dict[str, str], token["userinfo"])

    google_id = userinfo["sub"]
    email = userinfo["email"]
    name = userinfo.get("name", email)
    picture = userinfo.get("picture")

    user = await upsert_user(session, google_id=google_id, email=email, name=name, picture=picture)
    jwt_token = create_token(user.id, user.email)
    return RedirectResponse(f"{settings.frontend_url}/auth/callback?token={jwt_token}")


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    picture: str | None


@router.get("/me")
async def me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        picture=current_user.picture,
    )
