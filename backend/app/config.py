import os

def get_database_url():
    return os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://user:password@mysql/task_manager"
    )
