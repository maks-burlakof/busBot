import telebot

from clients import TelegramClient, SiteParser
from actioners import UserActioner


class MyBot(telebot.TeleBot):
    def __init__(self, telegram_client: TelegramClient, user_actioner: UserActioner,
                 parser: SiteParser, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.telegram_client = telegram_client
        self.db = user_actioner
        self.parser = parser

    def setup(self):
        self.db.setup()

    def shutdown(self):
        self.db.shutdown()

    def send_message_quit(self, chat_id: int, text: str, parse_mode=None, reply_markup=None, *args):
        super().send_message(chat_id, text, parse_mode=parse_mode, reply_markup=reply_markup,
                             disable_notification=True, *args)

    def delete_messages_safe(self, chat_id: int, message_ids: list):
        for mess_id in message_ids:
            try:
                super().delete_message(chat_id, mess_id)
            except telebot.apihelper.ApiTelegramException:
                pass
