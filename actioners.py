from datetime import date
from clients import SQLiteClient


class UserActioner:
    GET_USER = 'SELECT user_id, username, chat_id, notify_date, track_data, parse_date  FROM users WHERE user_id = %s;'
    GET_ALL_USERS = 'SELECT username, chat_id, notify_date, track_data FROM users'
    CREATE_USER = 'INSERT INTO users (user_id, username, chat_id) VALUES (?, ?, ?);'
    UPDATE_NOTIFY_DATE = 'UPDATE users SET notify_date = ? WHERE user_id = ?;'
    UPDATE_PARSE_DATE = 'UPDATE users SET parse_date = ? WHERE user_id = ?;'
    UPDATE_TRACK_DATA = 'UPDATE users SET track_data = ? WHERE user_id = ?;'

    CREATE_TABLE = """
        CREATE TABLE IF NOT EXISTS users (
            "user_id" INTEGER PRIMARY KEY NOT NULL UNIQUE,
            "username" TEXT NOT NULL,
            "chat_id" INTEGER NOT NULL,
            "notify_date" DATE,
            "track_data" TEXT,
            "parse_date" DATE
        );
    """

    def __init__(self, database_client: SQLiteClient):
        self.database_client = database_client

    def setup(self):
        self.database_client.create_conn()
        self.create_table()

    def shutdown(self):
        self.database_client.close_conn()

    def create_table(self):
        self.database_client.execute_command(self.CREATE_TABLE, ())

    def get_user(self, user_id: int):
        user = self.database_client.execute_select_command(self.GET_USER % user_id)
        return user[0] if user else []

    def get_all_users(self):
        return self.database_client.execute_select_command(self.GET_ALL_USERS)

    def create_user(self, user_id: str, username: str, chat_id: int):
        self.database_client.execute_command(self.CREATE_USER, (user_id, username, chat_id))

    def update_notify_date(self, user_id: int, updated_date: date or None):
        if updated_date:
            self.database_client.execute_command(self.UPDATE_NOTIFY_DATE, (updated_date, user_id))
        else:
            self.database_client.execute_command(self.UPDATE_NOTIFY_DATE, (None, user_id))

    def update_track_data(self, user_id: int, updated_data: str or None):
        if updated_data:
            self.database_client.execute_command(self.UPDATE_TRACK_DATA, (updated_data, user_id))
        else:
            self.database_client.execute_command(self.UPDATE_TRACK_DATA, (None, user_id))

    def update_parse_date(self, user_id: int, updated_date: date or None):
        if updated_date:
            self.database_client.execute_command(self.UPDATE_PARSE_DATE, (updated_date, user_id))
        else:
            self.database_client.execute_command(self.UPDATE_PARSE_DATE, (None, user_id))
