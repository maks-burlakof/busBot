from actioners import UserActioner
from clients.sqlite3_client import SQLiteClient
from clients.telegram_client import TelegramClient
from logging import getLogger, config
from envparse import Env
from datetime import date, timedelta

config.fileConfig(fname='logging_config.conf', disable_existing_loggers=False)
logger = getLogger(__name__)

env = Env()
TOKEN = env.str("TOKEN")


class Reminder:
    TIME_DELTA = 29

    GET_NOTIFY_DATA = f'SELECT chat_id, user_id FROM users WHERE (julianday(notify_data) - julianday() < {TIME_DELTA});'

    GET_TRACK_DATA = 'SELECT chat_id, user_id, track_data FROM users WHERE track_data NOT NULL;'

    def __init__(self, telegram_client: TelegramClient, database_client: SQLiteClient, user_actioner: UserActioner):
        self.telegram_client = telegram_client
        self.database_client = database_client
        self.user_actioner = user_actioner
        self.setted_up = False

    def setup(self):
        self.database_client.create_conn()
        self.setted_up = True

    def shutdown(self):
        self.database_client.close_conn()

    def notify(self, notify_ids: list):
        for chat_id, user_id in notify_ids:
            res = self.telegram_client.post(method="sendMessage", params={
                "text": f"Появились рейсы на {date.today() + timedelta(days=self.TIME_DELTA)}! Не забудь заказать!",
                "chat_id": chat_id})
            self.user_actioner.update_notify_data(user_id=str(user_id), updated_date=None)
            logger.info(res)

    def track(self, track_ids: list):
        for chat_id, user_id, track_data in track_ids:
            pass

    def execute_notify(self):
        if not self.setted_up:
            logger.error("Resources in worker.reminder has not been set up!")
            return
        logger.info('The execute_notify function is called')
        notify_ids = self.database_client.execute_select_command(self.GET_NOTIFY_DATA)
        if notify_ids:
            self.notify(notify_ids)

    def execute_track(self):
        if not self.setted_up:
            logger.error("Resources in worker.reminder has not been set up!")
            return
        logger.info('The execute_track function is called')
        track_ids = self.database_client.execute_select_command(self.GET_TRACK_DATA)
        if track_ids:
            self.track(track_ids)
