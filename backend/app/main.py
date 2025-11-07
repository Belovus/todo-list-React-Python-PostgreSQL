from fastapi import FastAPI
from app.api.endpoints.tasks import router as tasks_router
from .models.database import engine, Base

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
