import json
from datetime import date
from typing import Union

from clients import DatabaseClient


class DatabaseActions:
    def __init__(self, database_client: DatabaseClient):
        self.engine = database_client

    def setup(self):
        self.engine.create_conn()
        self._create_tables()

    def shutdown(self):
        self.engine.close_conn()

    def _create_tables(self):
        CREATE_USERS_TABLE = """
                CREATE TABLE IF NOT EXISTS users (
                    "user_id" INTEGER PRIMARY KEY NOT NULL UNIQUE,
                    "username" TEXT,
                    "chat_id" INTEGER NOT NULL,
                    "is_active" BOOLEAN NOT NULL CHECK ("is_active" IN (0, 1)),
                    "level" INT NOT NULL CHECK ("level" IN (1, 2)),
                    "notify_data" JSON,
                    "track_data" JSON,
                    "parse_data" JSON
                );
            """
        CREATE_INVITE_CODES_TABLE = """
                CREATE TABLE IF NOT EXISTS invite_codes (
                    "code" TEXT NOT NULL
                );
            """
        self.engine.execute_command(CREATE_USERS_TABLE, ())
        self.engine.execute_command(CREATE_INVITE_CODES_TABLE, ())

    @staticmethod
    def _get_json_data(raw_data) -> list:
        try:
            if isinstance(raw_data, tuple):
                data = json.loads(raw_data[0])
            elif isinstance(raw_data, list):
                data = json.loads(raw_data[0][0])
            elif isinstance(raw_data, str):
                data = json.loads(raw_data)
            else:
                data = []
        except (json.decoder.JSONDecodeError, TypeError, IndexError):
            data = []
        return data

    @staticmethod
    def _json_dump(data) -> str:
        return json.dumps(data, ensure_ascii=False)

    # Users

    def user_get(self, user_id: int) -> dict:
        user_raw = self.engine.execute_select_command('SELECT user_id, username, chat_id, is_active, level, notify_data, track_data, parse_data FROM users WHERE user_id = %s;' % user_id)
        if user_raw:
            return {
                'user_id': user_raw[0][0],
                'username': user_raw[0][1],
                'chat_id': user_raw[0][2],
                'is_active': user_raw[0][3],
                'level': user_raw[0][4],
                'notify': self._get_json_data(user_raw[0][5]),
                'track': self._get_json_data(user_raw[0][6]),
                'parse': self._get_json_data(user_raw[0][7]),
            }
        else:
            return {}

    def user_is_active(self, user_id) -> bool:
        response = self.engine.execute_select_command('SELECT is_active FROM users WHERE user_id = %s;' % user_id)
        if response:
            return True if response[0][0] == 1 else False
        else:
            return False

    def user_make_active(self, user_id: int):
        self.engine.execute_command('UPDATE users SET is_active = 1 WHERE user_id = ?', (user_id,))

    def user_make_inactive(self, user_id: int):
        self.engine.execute_command('UPDATE users SET is_active = 0 WHERE user_id = ?', (user_id,))

    def user_add_active(self, user_id: int, username: str, chat_id: int):
        empty_list = json.dumps([])
        self.engine.execute_command(
            'INSERT INTO users (user_id, username, chat_id, is_active, level, notify_data, track_data, parse_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            (user_id, username, chat_id, 1, 1, empty_list, empty_list, empty_list)
        )

    def users_get_all(self):
        ids_raw = self.engine.execute_select_command('SELECT user_id FROM users')
        data = []
        for id_ in ids_raw:
            data.append(self.user_get(id_[0]))
        return data

    # Invite codes

    def invite_codes_get(self):
        codes = self.engine.execute_select_command('SELECT code FROM invite_codes')
        return [code[0] for code in codes]

    def invite_code_add(self, code: str):
        self.engine.execute_command('INSERT INTO invite_codes (code) VALUES (?);', (code,))

    def invite_code_remove(self, code: str):
        self.engine.execute_command('DELETE FROM invite_codes WHERE code = ?;', (code,))

    # Actions

    def action_update(self, user_id: int, action_data_name: str, action_data: list):
        completed_data = self._json_dump(action_data)
        self.engine.execute_command(f'UPDATE users SET {action_data_name} = ? WHERE user_id = ?;', (completed_data, user_id))
