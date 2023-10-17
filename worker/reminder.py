# Run script via python3 worker/reminder.py -a <action> [-l]

from functools import wraps
from datetime import date, datetime
from time import time
from argparse import ArgumentParser, BooleanOptionalAction
from copy import deepcopy
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

from main import bot


def check_working_time(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time()
        func(*args, **kwargs)
        end_time = time()

        execution_time = end_time - start_time
        if func.__name__ == 'track':
            bot.db.system_update('reminder_track_execution_time')
        if execution_time > 55:
            bot.log.warning(f'Reminder {func.__name__.title()} time limit exceeded: {round(execution_time, 1)} sec.')

    return wrapper


class Reminder:
    def __init__(self, is_log: bool):
        self.bot = bot
        self.is_log = is_log

        self.bot.setup()

    def __del__(self):
        self.bot.shutdown()

    def _log(self, message: str):
        if self.is_log:
            self.bot.log.info(message)

    @staticmethod
    def _markup_buy_ticket(url: str) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(InlineKeyboardButton('💳 Бронировать', url=url))
        return keyboard

    @check_working_time
    def notify(self):
        self._log('Reminder.notify() is called')
        self.bot.db.system_update('reminder_notify_time')
        for user in self.bot.db.users_get_all():
            new_data = user['notify'].copy()
            for dict_ in user['notify']:
                date_ = date(*[int(n) for n in dict_['date'].split('-')])
                if (date_ - date.today()).days <= self.bot.time_delta:
                    self.bot.send_message(
                        user['chat_id'],
                        self.bot.m('notify_notification') % date_.strftime('%-d %B %Yг. (%a)'),
                        parse_mode='Markdown',
                    )
                    new_data.remove(dict_)
                    self._log(f"Notify message ({date_}) sent to @{user['username']}")
            if new_data != user['notify']:
                self.bot.db.action_update(user['user_id'], 'notify_data', new_data)

    @check_working_time
    def track(self):
        self._log('Reminder.track() is called')
        self.bot.db.system_update('reminder_track_time')
        for user_id, chat_id, username, dict_ in self.bot.db.track_get_all_active():
            datetime_ = datetime.strptime(f"{dict_['date']} {dict_['time']}", '%Y-%m-%d %H:%M')
            if datetime_ < datetime.today():
                self.bot.db.track_remove_by_data(user_id, dict_)
                continue
            days_delta = (datetime_ - datetime.today()).days

            if days_delta >= 1:  # not tomorrow
                if days_delta == 1:  # after one day
                    freq = 3
                elif days_delta <= 5:
                    freq = 5
                else:
                    freq = 10

                if dict_['passed'] < freq:
                    self.bot.db.track_update_by_data(user_id, dict_, 'passed', dict_['passed'] + 1)
                    continue
                else:
                    is_success = self.bot.db.track_update_by_data(user_id, dict_, 'passed', 0)
                    if is_success:
                        dict_['passed'] = 0
                    else:
                        continue

            free_seats = self.bot.parser.get_free_seats(
                dict_['from'], dict_['to'], dict_['date'], dict_['time']
            )
            if free_seats:
                self.bot.send_message(
                    chat_id,
                    self.bot.m('track_notification') % (
                        datetime_.strftime('%-d %B %Yг. (%a)'), dict_['from'], dict_['to'], dict_['time']
                    ),
                    parse_mode='Markdown',
                    reply_markup=self._markup_buy_ticket(self.bot.parser.prepare_url(
                        dict_['from'], dict_['to'], dict_['date']
                    )),
                )
                self.bot.db.track_update_by_data(user_id, dict_, 'is_active', 0)
                self._log(f"Track message ({datetime_.strftime('%-d %B %Yг. (%a)')}, "
                          f"{dict_['from']}-{dict_['to']} {dict_['time']}) sent to @{username}")


if __name__ == '__main__':
    parser = ArgumentParser(description='Run the Reminder')
    parser.add_argument('-action', '-a', type=str, default='None', help='Action to be executed')
    parser.add_argument('-log', '-l', default=False, action=BooleanOptionalAction, help='Turn on logging')
    args = parser.parse_args()

    action = args.action.lower()

    reminder = Reminder(args.log)
    if action == 'track':
        reminder.track()
    elif action == 'notify':
        reminder.notify()
