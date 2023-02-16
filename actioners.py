from datetime import date
from typing import Union

from clients import SQLiteClient


class UserActioner:
    def __init__(self, database_client: SQLiteClient):
        self.database_client = database_client

    def setup(self):
        self.database_client.create_conn()
        self.create_tables()

    def shutdown(self):
        self.database_client.close_conn()

    def create_tables(self):
        CREATE_USERS_TABLE = """
                CREATE TABLE IF NOT EXISTS users (
                    "user_id" INTEGER PRIMARY KEY NOT NULL UNIQUE,
                    "username" TEXT,
                    "chat_id" INTEGER NOT NULL,
                    "notify_date" DATE,
                    "track_data" TEXT,
                    "parse_date" DATE,
                    "track_time_passed" INTEGER
                );
            """
        CREATE_CITY_DATA_TABLE = """
                CREATE TABLE IF NOT EXISTS city_data (
                    "name" TEXT NOT NULL,
                    "key" TEXT NOT NULL
                );
            """
        CREATE_USER_WHITELIST_TABLE = """
                CREATE TABLE IF NOT EXISTS user_whitelist (
                    "username" TEXT NOT NULL
                );
            """
        CREATE_INVITE_CODES_TABLE = """
                CREATE TABLE IF NOT EXISTS invite_codes (
                    "code" TEXT NOT NULL
                );
            """
        self.database_client.execute_command(CREATE_USERS_TABLE, ())
        self.database_client.execute_command(CREATE_CITY_DATA_TABLE, ())
        self.database_client.execute_command(CREATE_USER_WHITELIST_TABLE, ())
        self.database_client.execute_command(CREATE_INVITE_CODES_TABLE, ())

    def get_user(self, user_id: int):
        user = self.database_client.execute_select_command('SELECT user_id, username, chat_id, notify_date, track_data, parse_date FROM users WHERE user_id = %s;' % user_id)
        return user[0] if user else []

    def get_all_users(self):
        return self.database_client.execute_select_command('SELECT username, chat_id, notify_date, track_data FROM users')

    def get_city_data(self):
        data = self.database_client.execute_select_command('SELECT name, key FROM city_data')
        return {name: key for name, key in data}

    def get_user_whitelist(self):
        return self.database_client.execute_select_command('SELECT username FROM user_whitelist')

    def get_invite_codes(self):
        return self.database_client.execute_select_command('SELECT code FROM invite_codes')

    def add_user(self, user_id: str, username: str, chat_id: int):
        self.database_client.execute_command('INSERT INTO users (user_id, username, chat_id) VALUES (?, ?, ?);', (user_id, username, chat_id))

    def add_user_in_whitelist(self, username: str):
        self.database_client.execute_command('INSERT INTO user_whitelist (username) VALUES (?);', (username,))

    def add_invite_code(self, code: str):
        self.database_client.execute_command('INSERT INTO invite_codes (code) VALUES (?);', (code,))

    def remove_user_from_whitelist(self, username: str):
        self.database_client.execute_command('DELETE FROM user_whitelist WHERE username = ?;', (username,))

    def remove_invite_code(self, code: str):
        self.database_client.execute_command('DELETE FROM invite_codes WHERE code = ?;', (code,))

    def update_notify_date(self, user_id: int, updated_date: Union[date, None]):
        self.database_client.execute_command('UPDATE users SET notify_date = ? WHERE user_id = ?;', (updated_date, user_id))

    def update_track_data(self, user_id: int, updated_data: Union[str, None]):
        self.database_client.execute_command('UPDATE users SET track_data = ? WHERE user_id = ?;', (updated_data, user_id))

    def update_track_time_passed(self, user_id: int, updated_delta: Union[int, None]):
        if updated_delta == -1:
            self.database_client.execute_command('UPDATE users SET track_time_passed = track_time_passed + ? WHERE user_id = ?;', (1, user_id))
        else:
            self.database_client.execute_command('UPDATE users SET track_time_passed = ? WHERE user_id = ?;', (updated_delta, user_id))

    def update_parse_date(self, user_id: int, updated_date: Union[date, None]):
        self.database_client.execute_command('UPDATE users SET parse_date = ? WHERE user_id = ?;', (updated_date, user_id))
