from clients.sqlite3_client import SQLiteClient


class UserActioner:
    # TODO: Создать таблицу если не создана

    GET_USER = """
    SELECT user_id, username, chat_id FROM users WHERE user_id = %s;
    """

    CREATE_USER = """
    INSERT INTO users (user_id, username, chat_id) VALUES (?, ?, ?);
    """

    CREATE_TABLE = """
        CREATE TABLE IF NOT EXISTS users (
            "user_id" INTEGER PRIMARY KEY NOT NULL UNIQUE,
            "username" TEXT NOT NULL,
            "chat_id" INTEGER NOT NULL
        );
    """

    def __init__(self, database_client: SQLiteClient):
        self.database_client = database_client

    def setup(self):
        self.database_client.create_conn()

    def shutdown(self):
        self.database_client.close_conn()

    def get_user(self, user_id: str):
        user = self.database_client.execute_select_command(self.GET_USER % user_id)
        return user[0] if user else []

    def create_user(self, user_id: str, username: str, chat_id: int):
        self.database_client.execute_command(self.CREATE_USER, (user_id, username, chat_id))

# user_actioner = UserActioner(SQLiteClient('users.db'))
# user_actioner.setup()
# user = user_actioner.get_user('10')
# print(user)
# user_actioner.create_user('10', 'testname', 12345)
