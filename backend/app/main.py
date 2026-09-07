from fastapi import FastAPI
from sqlalchemy import text

from app import models
from app.database import Base, engine
from app.routers.nodes import router as nodes_router


Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="Lattice Coordinator",
    description="Volunteer distributed compute coordinator",
    version="0.1.0"
)


app.include_router(
    nodes_router
)


@app.get("/")
def root():
    return {
        "message": "Lattice Coordinator is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/health/database")
def database_health():
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT current_database()")
        )

        database_name = result.scalar()

    return {
        "status": "healthy",
        "database": database_name
    }