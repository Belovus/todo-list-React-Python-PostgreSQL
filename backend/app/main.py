from fastapi import FastAPI
from .api.endpoints.tasks import (router as tasks_router)
from .models.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

try:
    Base.metadata.create_all(bind=engine)
    print("Таблицы успешно созданы")
except Exception as e:
    print(f"Ошибка при создании таблиц: {e}")

app = FastAPI(
    title="TODO",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5173",
        "http://frontend:5173",
        "http://nginx",
        "http://localhost:80"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "TODO App is working"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "MySQL"}

@app.get("/info")
async def api_info():
    return {
        "name": "TODO",
        "version": "1.0.0",
        "database": "MySQL",
    }
