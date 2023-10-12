from datetime import date
from telebot.types import (Message, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove, InlineKeyboardMarkup,
                           InlineKeyboardButton, CallbackQuery, BotCommand, BotCommandScopeChat)

from botclass import MyBot
from markups import Calendar
from clients import SiteParser


class BaseMarkup:
    def __init__(self):
        self.sep = ';'
        self.prefix = 'BASE'
        self.prefix_calendar = 'BASECAL'
        self.prefix_cities = 'BASECITY'
        self.prefix_time = 'BASETIME'

        self._calendar = Calendar(self.sep)
        self._cities = SiteParser().get_cities()

    def calendar_create(self):
        return self._calendar.create_calendar(self.prefix_calendar)

    def calendar_handler(self, bot: MyBot, call: CallbackQuery, callback_data: list):
        return self._calendar.calendar_query_handler(bot, call, self.prefix_calendar, callback_data[1],
                                                     callback_data[2], callback_data[3], callback_data[4])

    def add(self, total_num: int) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(InlineKeyboardButton(
            '✅ Добавить',
            callback_data=self.sep.join([self.prefix, 'ADD', '-1', str(total_num)]))
        )
        return keyboard

    def delete_update(self, index: int, total_num: int, date_: str, from_: str = '',
                      to_: str = '', time_: str = '') -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(
            InlineKeyboardButton(
                '❌ Отменить',
                callback_data=self.sep.join([self.prefix, 'DEL', str(index), str(total_num), date_, from_, to_, time_])
            ),
            InlineKeyboardButton(
                '🔄',
                callback_data=self.sep.join([self.prefix, 'UPD', str(index), str(total_num), date_, from_, to_, time_])
            ),
        )
        return keyboard

    def cities(self, city_from: str = '', city_to: str = '') -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(
            InlineKeyboardButton(
                'Отправление:',
                callback_data=self.sep.join([self.prefix_cities, 'IGNORE', city_from, city_to])
            ),
            InlineKeyboardButton(
                'Прибытие:',
                callback_data=self.sep.join([self.prefix_cities, 'IGNORE', city_from, city_to])
            )
        )
        for city in self._cities:
            keyboard.add(
                InlineKeyboardButton(
                    city if city != city_from else city + ' 👈',
                    callback_data=self.sep.join([
                        self.prefix_cities, 'CITYSET' if city != city_from and city != city_to else 'IGNORE', city, city_to]
                    )),
                InlineKeyboardButton(
                    city if city != city_to else '👉 ' + city,
                    callback_data=self.sep.join([
                        self.prefix_cities, 'CITYSET' if city != city_to and city != city_from else 'IGNORE', city_from, city
                    ])))
        if city_from and city_to:
            keyboard.add(InlineKeyboardButton(
                'Готово!',
                callback_data=self.sep.join([self.prefix_cities, 'CITYSUBMIT', city_from, city_to]))
            )
        return keyboard

    def cities_handler(self, bot: MyBot, call: CallbackQuery, callback_data: list):
        action = callback_data[1]
        if action == 'CITYSET':
            bot.edit_message_reply_markup(
                call.message.chat.id,
                call.message.id,
                reply_markup=self.cities(city_from=callback_data[2], city_to=callback_data[3])
            )
        elif action == 'CITYSUBMIT':
            bot.delete_messages_safe(call.message.chat.id, [call.message.id])
            return callback_data[2], callback_data[3]
        return None

    def departure_time(self, parser_data: dict) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        for bus in parser_data:
            time = parser_data[bus]['departure_time']
            free_places = parser_data[bus]['free_places_info']
            keyboard.add(InlineKeyboardButton(
                f'{time} ({free_places})',
                callback_data=self.sep.join([self.prefix_time, time, free_places]))
            )
        return keyboard

    def buy_ticket(self, url: str) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(InlineKeyboardButton('💳 Заказать на сайте', url=url))
        return keyboard


class BaseAction:
    def __init__(self, bot: MyBot):
        self.bot = bot
        self.markups = BaseMarkup()

    def is_allowed_user(self, message: Message, is_silent=False):
        if self.bot.db.user_is_active(message.from_user.id):
            return True
        else:
            if not is_silent:
                if message.text == '/start':
                    self.bot.send_sticker(message.chat.id, self.bot.m('start_anonymous_user_sticker'))
                    self.bot.send_message(message.chat.id, self.bot.m('start_anonymous_user') + self.bot.m('not_allowed_base'))
                else:
                    self.bot.send_message_quiet(message.chat.id, self.bot.m('not_allowed') + self.bot.m('not_allowed_base'))
            return False

    def is_admin(self, message: Message):
        if message.chat.id == self.bot.admin_chat_id:
            return True
        else:
            self.bot.send_message_quiet(message.chat.id, self.bot.m('no_rights'))
            return False

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

    def _callback(self, call: CallbackQuery):
        callback_data = call.data.split(self.markups.sep)
        name = callback_data[0]
        action = callback_data[1]

        user_id = call.from_user.id
        chat_id = call.message.chat.id

        if action == 'CANCEL':
            self.bot.answer_callback_query(call.id, self.bot.m('cancel'))

        elif action == 'ADD':
            self._add(user_id, chat_id)
            self._start_delete_msgs(call, callback_data)

        elif action == 'DEL':
            self._delete(call, user_id, chat_id, callback_data[4], callback_data[5], callback_data[6], callback_data[7])
            self._start_delete_msgs(call, callback_data)

        elif action == 'UPD':
            self._update(call, callback_data[4], callback_data[5], callback_data[6], callback_data[7])

        if name == self.markups.prefix_calendar:
            chosen_date = self.markups.calendar_handler(self.bot, call, callback_data)
            if action == 'DAY':
                self._date_select(call, user_id, chat_id, chosen_date)

        elif name == self.markups.prefix_cities:
            cities = self.markups.cities_handler(self.bot, call, callback_data)
            if action == 'CITYSUBMIT':
                self._cities_select(user_id, chat_id, *cities)

        elif name == self.markups.prefix_time:
            self._time_select(call, user_id, chat_id, callback_data[1], callback_data[2])

    def _add(self, *args, **kwargs):
        pass

    def _delete(self, *args, **kwargs):
        pass

    def _update(self, *args, **kwargs):
        pass

    def _date_select(self, *args, **kwargs):
        pass

    def _cities_select(self, *args, **kwargs):
        pass

    def _time_select(self, *args, **kwargs):
        pass
