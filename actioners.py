from datetime import date
from clients import SQLiteClient


class UserActioner:
    GET_USER = 'SELECT user_id, username, chat_id, notify_date, track_data, parse_date FROM users WHERE user_id = %s;'
    GET_ALL_USERS = 'SELECT username, chat_id, notify_date, track_data FROM users'
    GET_CITY_DATA = 'SELECT name, key FROM city_data'
    GET_USER_WHITELIST = 'SELECT username FROM user_whitelist'
    GET_INVITE_CODES = 'SELECT code FROM invite_codes'
    ADD_USER = 'INSERT INTO users (user_id, username, chat_id) VALUES (?, ?, ?);'
    ADD_USER_IN_WHITELIST = 'INSERT INTO user_whitelist (username) VALUES (?);'
    ADD_INVITE_CODE = 'INSERT INTO invite_codes (code) VALUES (?);'
    REMOVE_USER_WHITELIST = 'DELETE FROM user_whitelist WHERE username = ?;'
    REMOVE_INVITE_CODE = 'DELETE FROM invite_codes WHERE code = ?;'
    UPDATE_NOTIFY_DATE = 'UPDATE users SET notify_date = ? WHERE user_id = ?;'
    UPDATE_PARSE_DATE = 'UPDATE users SET parse_date = ? WHERE user_id = ?;'
    UPDATE_TRACK_DATA = 'UPDATE users SET track_data = ? WHERE user_id = ?;'
    UPDATE_TRACK_TIME_PASSED = 'UPDATE users SET track_time_passed = ? WHERE user_id = ?;'
    UPDATE_SUM_TRACK_TIME_PASSED = 'UPDATE users SET track_time_passed = track_time_passed + ? WHERE user_id = ?;'

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

    def __init__(self, database_client: SQLiteClient):
        self.database_client = database_client

    def setup(self):
        self.database_client.create_conn()
        self.create_tables()

    def shutdown(self):
        self.database_client.close_conn()

    def create_tables(self):
        self.database_client.execute_command(self.CREATE_USERS_TABLE, ())
        self.database_client.execute_command(self.CREATE_CITY_DATA_TABLE, ())
        self.database_client.execute_command(self.CREATE_USER_WHITELIST_TABLE, ())
        self.database_client.execute_command(self.CREATE_INVITE_CODES_TABLE, ())

    def get_user(self, user_id: int):
        user = self.database_client.execute_select_command(self.GET_USER % user_id)
        return user[0] if user else []

    def get_all_users(self):
        return self.database_client.execute_select_command(self.GET_ALL_USERS)

    def get_city_data(self):
        data = self.database_client.execute_select_command(self.GET_CITY_DATA)
        return {name: key for name, key in data}

    def get_user_whitelist(self):
        return self.database_client.execute_select_command(self.GET_USER_WHITELIST)

    def get_invite_codes(self):
        return self.database_client.execute_select_command(self.GET_INVITE_CODES)

    def add_user(self, user_id: str, username: str, chat_id: int):
        self.database_client.execute_command(self.ADD_USER, (user_id, username, chat_id))

    def add_user_in_whitelist(self, username: str):
        self.database_client.execute_command(self.ADD_USER_IN_WHITELIST, (username,))

    def add_invite_code(self, code: str):
        self.database_client.execute_command(self.ADD_INVITE_CODE, (code,))

    def remove_user_from_whitelist(self, username: str):
        self.database_client.execute_command(self.REMOVE_USER_WHITELIST, (username,))

    def remove_invite_code(self, code: str):
        self.database_client.execute_command(self.REMOVE_INVITE_CODE, (code,))

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

    def update_track_time_passed(self, user_id: int, updated_delta: int or None):
        if updated_delta == -1:
            self.database_client.execute_command(self.UPDATE_SUM_TRACK_TIME_PASSED, (1, user_id))
        elif not updated_delta:
            self.database_client.execute_command(self.UPDATE_TRACK_TIME_PASSED, (None, user_id))
        else:
            self.database_client.execute_command(self.UPDATE_TRACK_TIME_PASSED, (updated_delta, user_id))

    def update_parse_date(self, user_id: int, updated_date: date or None):
        if updated_date:
            self.database_client.execute_command(self.UPDATE_PARSE_DATE, (updated_date, user_id))
        else:
            self.database_client.execute_command(self.UPDATE_PARSE_DATE, (None, user_id))
