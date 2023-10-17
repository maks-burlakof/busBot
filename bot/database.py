import json
from datetime import datetime

from clients import DatabaseClient


class DatabaseActions:
    def __init__(self, database_client: DatabaseClient):
        self.engine = database_client
        self.datetime_scheme = '%Y-%m-%d %H:%M:%S'

    def setup(self):
        self.engine.create_conn()
        self._create_tables()

    def shutdown(self):
        self.engine.close_conn()

    def _datetime_to_str(self, datetime_: datetime = None):
        if not datetime_:
            datetime_ = datetime.now()
        return datetime_.strftime(self.datetime_scheme)

    def _str_to_datetime(self, string: str):
        return datetime.strptime(string, self.datetime_scheme)

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
        CREATE_SYSTEM_TABLE = """
            CREATE TABLE IF NOT EXISTS system (
                "id" INTEGER NOT NULL UNIQUE DEFAULT 0,
                "start_time" TEXT NOT NULL DEFAULT '%s',
                "exception_time" TEXT NOT NULL DEFAULT '%s',
                "reminder_track_time" TEXT NOT NULL DEFAULT '%s',
                "reminder_track_execution_time" TEXT NOT NULL DEFAULT '0',
                "reminder_notify_time" TEXT NOT NULL DEFAULT '%s',
                "logs_clear_time" TEXT NOT NULL DEFAULT '%s'
            );
        """ % ((self._datetime_to_str(),) * 5)

        self.engine.execute(CREATE_USERS_TABLE, ())
        self.engine.execute(CREATE_INVITE_CODES_TABLE, ())
        self.engine.execute(CREATE_SYSTEM_TABLE, ())
        self.engine.execute('INSERT OR IGNORE INTO system DEFAULT VALUES;', ())

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
        user_raw = self.engine.execute_select('SELECT user_id, username, chat_id, is_active, level, notify_data, track_data, parse_data FROM users WHERE user_id = %s;' % user_id)
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
        response = self.engine.execute_select('SELECT is_active FROM users WHERE user_id = %s;' % user_id)
        if response:
            return True if response[0][0] == 1 else False
        else:
            return False

    def user_make_active(self, user_id: int):
        self.engine.execute('UPDATE users SET is_active = 1 WHERE user_id = ?', (user_id,))

    def user_make_inactive(self, user_id: int):
        self.engine.execute('UPDATE users SET is_active = 0 WHERE user_id = ?', (user_id,))

    def user_add_active(self, user_id: int, username: str, chat_id: int):
        empty_list = json.dumps([])
        self.engine.execute(
            'INSERT INTO users (user_id, username, chat_id, is_active, level, notify_data, track_data, parse_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            (user_id, username, chat_id, 1, 1, empty_list, empty_list, empty_list)
        )

    def users_get_all(self):
        ids_raw = self.engine.execute_select('SELECT user_id FROM users')
        data = []
        for id_ in ids_raw:
            data.append(self.user_get(id_[0]))
        return data

    # Invite codes

    def invite_codes_get(self):
        codes = self.engine.execute_select('SELECT code FROM invite_codes')
        return [code[0] for code in codes]

    def invite_code_add(self, code: str):
        self.engine.execute('INSERT INTO invite_codes (code) VALUES (?);', (code,))

    def invite_code_remove(self, code: str):
        self.engine.execute('DELETE FROM invite_codes WHERE code = ?;', (code,))

    # Actions

    def action_update(self, user_id: int, action_data_name: str, action_data: list):
        completed_data = self._json_dump(action_data)
        self.engine.execute(f'UPDATE users SET {action_data_name} = ? WHERE user_id = ?;', (completed_data, user_id))

    # For reminder

    def track_get_all_active(self) -> list:
        sql_query = "SELECT user_id, chat_id, username, json_extract(value, '$') AS track_date " \
                    "FROM users, json_each(users.track_data) " \
                    "WHERE " \
                    "track_date IS NOT NULL " \
                    "AND json_extract(track_date, '$.is_active') = 1 " \
                    ";"
        raw_data = self.engine.execute_select(sql_query)
        return [(raw_tuple[0], raw_tuple[1], raw_tuple[2], self._get_json_data(raw_tuple[3])) for raw_tuple in raw_data]

    def track_remove_by_data(self, user_id: int, data_to_remove: dict) -> bool:
        """
        :return: Was the element successfully removed
        """
        data_raw = self.engine.execute_select('SELECT track_data FROM users WHERE user_id = %s;' % user_id)
        data = self._get_json_data(data_raw)
        try:
            index_to_delete = data.index(data_to_remove)
        except ValueError:
            return False
        else:
            data.pop(index_to_delete)
            completed_data = self._json_dump(data)
            self.engine.execute('UPDATE users SET track_data = ? WHERE user_id = ?;', (completed_data, user_id))
            return True

    def track_update_by_data(self, user_id: int, searched_data: dict, key: str, value) -> bool:
        """
        Update specific track date for the user without any checks.
        """
        data_raw = self.engine.execute_select('SELECT track_data FROM users WHERE user_id = %s;' % user_id)
        data = self._get_json_data(data_raw)
        try:
            index_to_update = data.index(searched_data)
        except ValueError:
            return False
        else:
            data[index_to_update][key] = value
            completed_data = self._json_dump(data)
            self.engine.execute('UPDATE users SET track_data = ? WHERE user_id = ?;', (completed_data, user_id))
            return True

    # System

    def system_get(self):
        data_raw = self.engine.execute_select('SELECT * FROM system WHERE id = 0;')
        return {
            'start_time': self._str_to_datetime(data_raw[0][1]),
            'exception_time': self._str_to_datetime(data_raw[0][2]),
            'reminder_track_time': self._str_to_datetime(data_raw[0][3]),
            'reminder_track_execution_time': data_raw[0][4],
            'reminder_notify_time': self._str_to_datetime(data_raw[0][5]),
            'logs_clear_time': self._str_to_datetime(data_raw[0][6]),
        }

    def system_update(self, name: str, value: datetime | str = None):
        if not isinstance(value, str):
            value = self._datetime_to_str(value)
        self.engine.execute('UPDATE system SET %s = ? WHERE id = 0;' % name, (value,))
