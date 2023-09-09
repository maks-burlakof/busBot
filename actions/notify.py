from random import choice
from telebot.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton

from actions.base import Action
from message_texts import *


class NotifyMarkups:
    def __init__(self):
        self.sep = ';'
        self.prefix = 'NOTIFY'

    def add(self, total_num: int) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(InlineKeyboardButton('✅ Добавить', callback_data=self.sep.join([self.prefix, 'ADD', '-1', str(total_num)])))
        return keyboard

    def remove(self, index: int, total_num: int) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(InlineKeyboardButton('❌ Отменить', callback_data=self.sep.join([self.prefix, 'REMOVE', str(index), str(total_num)])))
        return keyboard


class Notify(Action):
    def __init__(self, bot, calendar_markup, calendar_callback):
        super().__init__(bot, calendar_markup, calendar_callback)
        self.markups = NotifyMarkups()

        self.max_dates = 3

    def _get_data(self, user_id: int):
        user = self.bot.db.get_user(user_id)
        if user:
            return user[3]
        else:
            return None

    def notify(self, message: Message):
        user_id = message.from_user.id
        chat_id = message.chat.id

        notify_data = self._get_data(user_id)

        if notify_data:
            len_data = len(notify_data)
            markup = self.markups.add(len_data) if len_data < self.max_dates else None
            self.bot.send_message(chat_id, NOTIFY_EXISTS_MSG, reply_markup=markup, parse_mode='Markdown')
            for i in range(len_data):
                notify_date = self._get_date_obj(notify_data[i]['date'])
                self.bot.send_message_quit(chat_id, NOTIFY_TEMPLATE_MSG % notify_date.strftime('%d %B %Yг. (%a)'),
                                           reply_markup=self.markups.remove(i, len_data))
        else:
            self.bot.db.add_notify_date(user_id)
            self.bot.send_message(chat_id, NOTIFY_INPUT_MSG,
                                  reply_markup=self.calendar.create_calendar(name=self.calendar_callback.prefix))

    def add(self, call: CallbackQuery):
        user_id = call.from_user.id
        chat_id = call.message.chat.id

        notify_data = self._get_data(user_id)

        if len(notify_data) < self.max_dates:
            self.bot.db.add_notify_date(user_id)
            self.bot.send_message_quit(chat_id, NOTIFY_INPUT_MSG,
                                       reply_markup=self.calendar.create_calendar(name=self.calendar_callback.prefix))
        else:
            self.bot.send_message_quit(chat_id, notify_track_limit_exceeded_msg(self.max_dates))

    def remove(self, call: CallbackQuery, index: int):
        user_id = call.from_user.id
        chat_id = call.message.chat.id

        self.bot.db.remove_notify_date(user_id, index)
        self.bot.send_message_quit(chat_id, choice(NOTIFY_RESET_EXISTS_MSGS))
