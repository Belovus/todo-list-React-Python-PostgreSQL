from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.models.database import get_db
from app.models.task import TaskStatus
from app.schemas.tasks import Task, TaskCreate, TaskUpdate
from app.crud.tasks import (
    get_tasks, get_task, create_task, update_task, delete_task, get_tasks_count
)

router = APIRouter()

@router.post(
    "/",
    response_model=Task,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новую задачу",
    description="Создает новую задачу с указанным заголовком, описанием и статусом"
)
def create_new_task(task: TaskCreate, db: Session = Depends(get_db)):
    return create_task(db=db, task=task)

@router.get(
    "/",
    response_model=List[Task],
    summary="Получить список задач",
    description="Возвращает список задач с возможностью фильтрации по статусу и пагинацией"
)
def read_tasks(
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Лимит записей"),
    status: Optional[TaskStatus] = Query(None, description="Фильтр по статусу задачи"),
    db: Session = Depends(get_db)
):
    tasks = get_tasks(db, skip=skip, limit=limit, status=status)
    return tasks

@router.get(
    "/{task_id}",
    response_model=Task,
    summary="Получить задачу по ID",
    description="Возвращает задачу по указанному идентификатору"
)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задача не найдена"
        )
    return db_task

@router.put(
    "/{task_id}",
    response_model=Task,
    summary="Обновить задачу",
    description="Обновляет данные задачи по указанному идентификатору"
)
def update_existing_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db)
):
    db_task = update_task(db, task_id=task_id, task_update=task_update)
    if db_task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задача не найдена"
        )
    return db_task

@router.delete(
    "/{task_id}",
    status_code=status.HTTP_200_OK,
    summary="Удалить задачу",
    description="Удаляет задачу по указанному идентификатору"
)
def delete_existing_task(task_id: int, db: Session = Depends(get_db)):
    success = delete_task(db, task_id=task_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Задача не найдена"
        )
    return {"message": "Задача успешно удалена"}
