from datetime import date
from clients.sqlite3_client import SQLiteClient


class UserActioner:
    GET_USER = 'SELECT user_id, username, chat_id FROM users WHERE user_id = %s;'

    GET_ALL_USERS = 'SELECT username, chat_id FROM users'

    CREATE_USER = 'INSERT INTO users (user_id, username, chat_id) VALUES (?, ?, ?);'

    UPDATE_NOTIFY_DATA = 'UPDATE users SET notify_data = ? WHERE user_id = ?;'

    UPDATE_TRACK_DATA = 'UPDATE users SET track_data = ? WHERE user_id = ?;'

    CREATE_TABLE = """
        CREATE TABLE IF NOT EXISTS users (
            "user_id" INTEGER PRIMARY KEY NOT NULL UNIQUE,
            "username" TEXT NOT NULL,
            "chat_id" INTEGER NOT NULL,
            "notify_data" TEXT,
            "track_data" TEXT
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

    def get_user(self, user_id: str):
        user = self.database_client.execute_select_command(self.GET_USER % user_id)
        return user[0] if user else []

    def get_all_users(self):
        return self.database_client.execute_select_command(self.GET_ALL_USERS)

    def create_user(self, user_id: str, username: str, chat_id: int):
        self.database_client.execute_command(self.CREATE_USER, (user_id, username, chat_id))

    def update_notify_data(self, user_id: str, updated_date: list):
        self.database_client.execute_command(self.UPDATE_NOTIFY_DATA, (str(updated_date), user_id))

    def update_track_data(self, user_id: str, updated_date: list):
        self.database_client.execute_command(self.UPDATE_TRACK_DATA, (str(updated_date), user_id))


if __name__ == '__main__':
    user_actioner = UserActioner(SQLiteClient('users.db'))
    user_actioner.setup()
    user = user_actioner.get_user('10')
    print(user)
    user_actioner.create_user('10', 'testname', 12345)
