import sqlite3


class SQLiteClient:
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.conn = None

    def create_conn(self):
        self.conn = sqlite3.connect(self.filepath, check_same_thread=False)

    def close_conn(self):
        self.conn.close()

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
