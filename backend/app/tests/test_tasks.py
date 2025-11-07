import pytest
from app.models.task import TaskStatus

class TestTaskCRUD:
    def test_create_task_success(self, client, sample_task_data):
        """Тест успешного создания задачи"""
        response = client.post("/api/v1/tasks/", json=sample_task_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == sample_task_data["title"]
        assert data["description"] == sample_task_data["description"]
        assert data["status"] == sample_task_data["status"]
        assert "id" in data
        assert "created_at" in data

    def test_create_task_with_minimal_data(self, client):
        """Тест создания задачи с минимальными данными"""
        minimal_data = {"title": "Minimal Task"}
        response = client.post("/api/v1/tasks/", json=minimal_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == minimal_data["title"]
        assert data["description"] is None
        assert data["status"] == "pending"  # default value

    def test_get_tasks_empty_list(self, client):
        """Тест получения пустого списка задач"""
        response = client.get("/api/v1/tasks/")
        
        assert response.status_code == 200
        data = response.json()
        assert data == []

    def test_get_tasks_with_data(self, client, sample_task_data):
        """Тест получения списка задач с данными"""
        # Создаем несколько задач
        client.post("/api/v1/tasks/", json=sample_task_data)
        client.post("/api/v1/tasks/", json={
            "title": "Second Task",
            "description": "Another description",
            "status": "in_progress"
        })
        
        response = client.get("/api/v1/tasks/")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["title"] == "Second Task"  # Сортировка по дате создания
        assert data[1]["title"] == "Test Task"

    def test_get_task_by_id_success(self, client, sample_task_data):
        """Тест успешного получения задачи по ID"""
        create_response = client.post("/api/v1/tasks/", json=sample_task_data)
        task_id = create_response.json()["id"]
        
        response = client.get(f"/api/v1/tasks/{task_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == task_id
        assert data["title"] == sample_task_data["title"]

    def test_get_task_by_id_not_found(self, client):
        """Тест получения несуществующей задачи"""
        response = client.get("/api/v1/tasks/999")
        
        assert response.status_code == 404
        assert response.json()["detail"] == "Задача не найдена"

    def test_update_task_success(self, client, sample_task_data):
        """Тест успешного обновления задачи"""
        create_response = client.post("/api/v1/tasks/", json=sample_task_data)
        task_id = create_response.json()["id"]
        
        update_data = {
            "title": "Updated Title",
            "status": "done"
        }
        
        response = client.put(f"/api/v1/tasks/{task_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["status"] == "done"
        assert data["description"] == sample_task_data["description"]  # Не изменилось

    def test_update_task_partial(self, client, sample_task_data):
        """Тест частичного обновления задачи"""
        create_response = client.post("/api/v1/tasks/", json=sample_task_data)
        task_id = create_response.json()["id"]
        
        # Обновляем только статус
        update_data = {"status": "in_progress"}
        
        response = client.put(f"/api/v1/tasks/{task_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "in_progress"
        assert data["title"] == sample_task_data["title"]  # Не изменился
        assert data["description"] == sample_task_data["description"]  # Не изменился

    def test_update_task_not_found(self, client):
        """Тест обновления несуществующей задачи"""
        update_data = {"title": "New Title"}
        response = client.put("/api/v1/tasks/999", json=update_data)
        
        assert response.status_code == 404
        assert response.json()["detail"] == "Задача не найдена"

    def test_delete_task_success(self, client, sample_task_data):
        """Тест успешного удаления задачи"""
        create_response = client.post("/api/v1/tasks/", json=sample_task_data)
        task_id = create_response.json()["id"]
        
        response = client.delete(f"/api/v1/tasks/{task_id}")
        
        assert response.status_code == 200
        assert response.json()["message"] == "Задача успешно удалена"
        
        # Проверяем, что задача действительно удалена
        get_response = client.get(f"/api/v1/tasks/{task_id}")
        assert get_response.status_code == 404

    def test_delete_task_not_found(self, client):
        """Тест удаления несуществующей задачи"""
        response = client.delete("/api/v1/tasks/999")
        
        assert response.status_code == 404
        assert response.json()["detail"] == "Задача не найдена"