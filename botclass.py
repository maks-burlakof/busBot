from random import choice
import telebot

from workers.reminder import TIME_DELTA
from clients import TelegramClient, SiteParser
from database import DatabaseActions


class MyBot(telebot.TeleBot):
    def __init__(
            self, *args, telegram_client: TelegramClient, parser_client: SiteParser,
            database_actions: DatabaseActions, logger, admin_chat_id: str, messages: dict, **kwargs
    ):
        super().__init__(*args, **kwargs)

        self.db = database_actions
        self.tg = telegram_client
        self.parser = parser_client
        self.log = logger

        self.admin_chat_id = int(admin_chat_id)
        self.time_delta = TIME_DELTA
        self._m = messages

    def setup(self):
        self.db.setup()

    def shutdown(self):
        self.db.shutdown()

    def m(self, message_key: str):
        return choice(self._m.get(message_key, ['']))

    def send_message_quiet(self, chat_id: int, text: str, parse_mode=None, reply_markup=None, *args):
        return super().send_message(chat_id, text, parse_mode=parse_mode, reply_markup=reply_markup,
                                    disable_notification=True, *args)

    def delete_messages_safe(self, chat_id: int, message_ids: list):
        for mess_id in message_ids:
            try:
                super().delete_message(chat_id, mess_id)
            except telebot.apihelper.ApiTelegramException:
                pass
