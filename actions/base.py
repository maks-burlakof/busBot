from datetime import date
from telebot.types import (Message, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove, InlineKeyboardMarkup,
                           InlineKeyboardButton, CallbackQuery)

from botclass import MyBot
from markups import Calendar


class BaseMarkup:
    def __init__(self):
        self.sep = ';'
        self._calendar = Calendar(self.sep)
        self.prefix = 'BASE'
        self.prefix_calendar = 'BASE-CALENDAR'

    def calendar_create(self):
        return self._calendar.create_calendar(self.prefix_calendar)

    def calendar_handler(self, bot: MyBot, call: CallbackQuery, callback_data: list):
        return self._calendar.calendar_query_handler(bot, call, self.prefix_calendar, callback_data[1],
                                                     callback_data[2], callback_data[3], callback_data[4])

    def add(self, total_num: int) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(InlineKeyboardButton('✅ Добавить', callback_data=self.sep.join([self.prefix, 'ADD', '-1', str(total_num)])))
        return keyboard

    def delete(self, index: int, total_num: int) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(InlineKeyboardButton('❌ Отменить', callback_data=self.sep.join([self.prefix, 'DELETE', str(index), str(total_num)])))
        return keyboard


class BaseAction:
    def __init__(self, bot: MyBot):
        self.bot = bot

    @staticmethod
    def _get_date_obj(date_str: str) -> date:
        y, m, d = [int(j) for j in date_str.split('-')]
        date_obj = date(y, m, d)
        return date_obj

    def _start_delete_msgs(self, call: CallbackQuery, callback_data: list):
        index_msg = int(callback_data[2])
        total_num = int(callback_data[3])
        ids_list = [
            *range(call.message.id - index_msg - 1, call.message.id),
            *range(call.message.id, call.message.id + total_num - index_msg)
        ]
        self.bot.delete_messages_safe(call.message.chat.id, ids_list)

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
