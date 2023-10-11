from datetime import date
from telebot.types import (Message, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove, InlineKeyboardMarkup,
                           InlineKeyboardButton, CallbackQuery)

from botclass import MyBot
from markups import Calendar


class BaseMarkup:
    def __init__(self):
        self.sep = ';'
        self._calendar = Calendar()

    def calendar(self, name: str = "calendar", year: int = None, month: int = None):
        return self._calendar.create_calendar(name, year, month)


class BaseAction:
    def __init__(self, bot: MyBot):
        self.bot = bot

    @staticmethod
    def _get_date_obj(date_str: str) -> date:
        y, m, d = [int(j) for j in date_str.split('-')]
        date_obj = date(y, m, d)
        return date_obj

    def is_allowed_user(self, message: Message, is_silent=False):
        if self.bot.db.user_is_active(message.from_user.id):
            return True
        else:
            if not is_silent:
                self.bot.send_message_quiet(message.chat.id, self.bot.m('not_allowed') + self.bot.m('not_allowed_base'))
            return False

    def is_admin(self, message: Message):
        if message.chat.id == self.bot.admin_chat_id:
            return True
        else:
            self.bot.send_message_quiet(message.chat.id, self.bot.m('no_rights'))
            return False
