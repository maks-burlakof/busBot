import sqlite3

CREATE_USER = """
    INSERT INTO users (user_id, username, chat_id) VALUES (?, ?, ?);
    """

GET_USER = """
    SELECT user_id, username, chat_id FROM users WHERE user_id = %s;
    """

CREATE_TABLE = """
    CREATE TABLE IF NOT EXISTS users (
        "user_id" INTEGER PRIMARY KEY NOT NULL UNIQUE,
        "username" TEXT NOT NULL,
        "chat_id" INTEGER NOT NULL
    );
"""


class SQLiteClient:
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.conn = None

    def create_conn(self):
        self.conn = sqlite3.connect(self.filepath, check_same_thread=False)

    def execute_command(self, command: str, params: tuple):
        if self.conn is not None:
            self.conn.execute(command, params)
            self.conn.commit()
        else:
            raise ConnectionError("you need to create connection to database!")

    def execute_select_command(self, command: str):
        if self.conn is not None:
            cur = self.conn.cursor()
            cur.execute(command)
            return cur.fetchall()
        else:
            raise ConnectionError("you need to create connection to database!")


# sqlite_client = SQLiteClient('users.db')
# sqlite_client.create_conn()
# sqlite_client.execute_command(CREATE_TABLE, ())
# sqlite_client.execute_command(CREATE_USER, (5, 'name2', 5678))
# print(sqlite_client.execute_select_command(GET_USER % (2, )))


class UserActioner:
     # TODO: Пересмотреть смысл user_id. Может сделать его autoincrement
     # TODO: Создать таблицу если не создана
    GET_USER = """
    SELECT user_id, username, chat_id FROM users WHERE user_id = %s;
    """

    CREATE_USER = """
    INSERT INTO users (user_id, username, chat_id) VALUES (?, ?, ?);
    """

    def __init__(self, database_client: SQLiteClient):
        self.database_client = database_client

    def setup(self):
        self.database_client.create_conn()

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
