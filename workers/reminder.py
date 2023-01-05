from logging import getLogger, config
from datetime import date, timedelta, datetime
from os import environ
from sys import path
from time import time

from message_texts import *
from clients import *
from actioners import UserActioner
from inline_markups import BuyTicketMarkup

config.fileConfig(fname='logging_config.conf', disable_existing_loggers=False)
logger = getLogger(__name__)

TOKEN = environ.get("TOKEN")

# days before the bus
TIME_DELTA = 29

# allowed working time for scripts
MAX_NOTIFY_TIME = 60
MAX_TRACK_TIME = 40


class Reminder:
    GET_NOTIFY_DATE = f'SELECT chat_id, user_id FROM users WHERE (julianday(notify_date) - julianday() < {TIME_DELTA});'

    GET_TRACK_DATA = 'SELECT chat_id, user_id, track_data FROM users WHERE track_data NOT NULL;'

    def __init__(self):
        self.telegram_client = TelegramClient(token=TOKEN, base_url="https://api.telegram.org")
        self.database_client = SQLiteClient(path[0] + '/../users.db')
        self.user_actioner = UserActioner(database_client=self.database_client)
        self.parser = SiteParser(user_actioner=self.user_actioner)
        self.buy_ticket_markup = BuyTicketMarkup()
        self.setted_up = False

    def setup(self):
        self.database_client.create_conn()
        self.setted_up = True

    def shutdown(self):
        self.database_client.close_conn()

    @staticmethod
    def check_working_time(start_time: float, end_time: float):
        if end_time - start_time > MAX_TRACK_TIME:
            logger.error('Script time limit exceeded!')

    def notify(self, notify_ids: list):
        for chat_id, user_id in notify_ids:
            res = self.telegram_client.post(method="sendMessage", params={
                "text": NOTIFY_MSG % str(date.today() + timedelta(days=TIME_DELTA)),
                "chat_id": chat_id})
            self.user_actioner.update_notify_date(user_id=user_id, updated_date=None)
            logger.debug(res)

    def track(self, track_ids: list):
        for chat_id, user_id, track_data in track_ids:
            try:
                track_date, city_from, city_to, departure_time = track_data.split()
            except ValueError:
                self.user_actioner.update_track_data(user_id, None)
                continue
            if datetime.strptime(f'{track_date} {departure_time}', '%Y-%m-%d %H:%M') < datetime.today():
                self.user_actioner.update_track_data(user_id, None)
                continue
            if self.parser.get_free_seats(city_from, city_to, track_date, departure_time):
                res = self.telegram_client.post(method="sendMessage", params={
                    "text": TRACK_MSG % (track_date, city_from, city_to, departure_time),
                    "chat_id": chat_id,
                    "parse_mode": 'Markdown',
                    "reply_markup": self.buy_ticket_markup.create(city_from, city_to, track_date).to_json()})
                self.user_actioner.update_track_data(user_id=user_id, updated_data=None)
                logger.debug(res)

    def execute_notify(self):
        if not self.setted_up:
            logger.error("Resources in worker.reminder has not been set up!")
            return
        logger.info('The execute_notify function is called')
        start_time = time()
        notify_ids = self.database_client.execute_select_command(self.GET_NOTIFY_DATE)
        if notify_ids:
            self.notify(notify_ids)
        end_time = time()
        self.check_working_time(start_time, end_time)

    def execute_track(self):
        if not self.setted_up:
            logger.error("Resources in worker.reminder has not been set up!")
            return
        logger.info('The execute_track function is called')
        start_time = time()
        track_ids = self.database_client.execute_select_command(self.GET_TRACK_DATA)
        if track_ids:
            self.track(track_ids)
        end_time = time()
        self.check_working_time(start_time, end_time)
