from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    google_client_id: str = ""
    google_client_secret: str = ""
    secret_key: str = "dev-secret-key-change-in-prod"
    database_url: str = "postgresql+psycopg://soma:soma@localhost:5432/soma"
    frontend_url: str = "http://localhost:4200"
    debug: bool = False


settings: Settings = Settings()  # type: ignore[call-arg]
