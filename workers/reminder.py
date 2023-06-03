from dotenv import load_dotenv
from logging import getLogger, config
from datetime import date, timedelta, datetime
from os import environ
from sys import path
from time import time
import locale

from message_texts import *
from clients import *
from actioners import UserActioner
from inline_markups import BuyTicketMarkup

load_dotenv()

config.fileConfig(fname='logging_config.conf', disable_existing_loggers=False)
logger = getLogger(__name__)

locale.setlocale(locale.LC_ALL, ('ru_RU', 'UTF-8'))

TOKEN = environ.get("TOKEN")

TIME_DELTA = 29  # days before the bus


class Reminder:
    def __init__(self):
        self.telegram_client = TelegramClient(token=TOKEN)
        self.database_client = SQLiteClient(path[0] + '/../users.db')
        self.user_actioner = UserActioner(database_client=self.database_client)
        self.parser = SiteParser(user_actioner=self.user_actioner)
        self.buy_ticket_markup = BuyTicketMarkup()

    def setup(self):
        self.database_client.create_conn()

    def shutdown(self):
        self.database_client.close_conn()

    @staticmethod
    def check_working_time(start_time: float, end_time: float):
        execution_time = end_time - start_time
        if execution_time > 55:
            logger.error(f'Script time limit exceeded: {round(execution_time, 1)}')

    def notify(self, data: list):
        for chat_id, user_id, notify_date in data:
            y, m, d = notify_date.split('-')
            res = self.telegram_client.post(method="sendMessage", params={
                "text": NOTIFY_MSG % date(int(y), int(m), int(d)).strftime('%d %B %Yг. (%a)'),
                "chat_id": chat_id,
                "parse_mode": 'Markdown'})
            logger.info(res)

            user_notify_data = self.user_actioner.get_user(user_id)[3]
            date_index = None
            for i in range(len(user_notify_data)):
                if user_notify_data[i]['date'] == notify_date:
                    date_index = i
                    break
            self.user_actioner.remove_notify_date(user_id, date_index)

    def track(self, data: list):
        for user_id, chat_id, track_date in data:
            track_date_time = datetime.strptime(f"{track_date['date']} {track_date['time']}", '%Y-%m-%d %H:%M')
            if track_date_time < datetime.today():
                self.user_actioner.remove_track_date_by_data(user_id, track_date)
                continue
            track_delta = (track_date_time - datetime.today()).days
            if track_delta >= 1:  # not tomorrow
                if track_delta == 1:  # after one day
                    track_freq = 3
                elif track_delta <= 5:
                    track_freq = 5
                else:
                    track_freq = 10

                if track_date['passed'] < track_freq:
                    self.user_actioner.update_track_date_by_data(user_id, track_date, "passed", track_date['passed'] + 1)
                    continue
                else:
                    is_success = self.user_actioner.update_track_date_by_data(user_id, track_date, "passed", 0)
                    if is_success:
                        track_date['passed'] = 0

            if self.parser.get_free_seats(track_date['from'], track_date['to'], track_date['date'], track_date['time']):
                res = self.telegram_client.post(method="sendMessage", params={
                    "text": TRACK_MSG % (track_date_time.strftime('%d %B %Yг. (%a)'), track_date['from'], track_date['to'], track_date['time']),
                    "chat_id": chat_id,
                    "parse_mode": 'Markdown',
                    "reply_markup": self.buy_ticket_markup.create(self.parser.prepare_url(track_date['from'], track_date['to'], track_date['date'])).to_json()})
                self.user_actioner.update_track_date_by_data(user_id, track_date, "is_active", "0")
                logger.info(res)

    def execute_notify(self):
        # logger.debug('The execute_notify function is called')
        sql_query = "SELECT chat_id, user_id, json_extract(value, '$.date') AS notify_date " \
                    "FROM users, json_each(users.notify_data) " \
                    "WHERE " \
                    "notify_date IS NOT NULL " \
                    'AND notify_date != "" ' \
                    f"AND (julianday(notify_date) - julianday() <= {TIME_DELTA - 1}) " \
                    ";"
        start_time = time()
        data = self.database_client.execute_select_command(sql_query)
        if data:
            self.notify(data)
        end_time = time()
        self.check_working_time(start_time, end_time)

    def execute_track(self):
        # logger.debug('The execute_track function is called')
        start_time = time()
        data = self.user_actioner.get_all_active_track_data()
        if data:
            self.track(data)
        end_time = time()
        self.check_working_time(start_time, end_time)
