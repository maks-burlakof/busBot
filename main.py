import telebot
from telebot.types import Message
from envparse import Env
from logging import getLogger, StreamHandler
from datetime import datetime
from clients.telegram_client import TelegramClient
from clients.sqlite3_client import SQLiteClient
from actioners import UserActioner

logger = getLogger(__name__)
logger.addHandler(StreamHandler())
logger.setLevel("INFO")

env = Env()
TOKEN = env.str('TOKEN')
ADMIN_CHAT_ID = env.str('ADMIN_CHAT_ID')


class MyBot(telebot.TeleBot):
    def __init__(self, telegram_client: TelegramClient, user_actioner: UserActioner, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.telegram_client = telegram_client
        self.user_actioner = user_actioner

    def setup_resources(self):
        self.user_actioner.setup()

    def shutdown_resources(self):
        self.user_actioner.shutdown()

    def shutdown(self):
        self.shutdown_resources()


telegram_client = TelegramClient(token=TOKEN, base_url="https://api.telegram.org")
user_actioner = UserActioner(SQLiteClient("users.db"))
bot = MyBot(token=TOKEN, telegram_client=telegram_client, user_actioner=user_actioner)


@bot.message_handler(commands=['start'])
def start(message: Message):
    user_id = message.from_user.id
    username = message.from_user.username
    chat_id = message.chat.id
    create_new_user = False

    user = bot.user_actioner.get_user(user_id=str(user_id))
    if not user:
        bot.user_actioner.create_user(user_id=str(user_id), username=username, chat_id=chat_id)
        create_new_user = True
    bot.reply_to(message=message, text=f"Вы {'уже' if not create_new_user else 'успешно'} зарегистрированы: {username}.\n"
                                       f"Ваш user_id: {user_id}")


def handle_standup_speech(message: Message):
    bot.send_message(chat_id=ADMIN_CHAT_ID, text=f"Пользователь @{message.from_user.username} говорит: {message.text}")
    bot.reply_to(message, "Ответ готов!")


@bot.message_handler(commands=["say_standup_speech"])
def say_standup_speech(message: Message):
    bot.reply_to(message, text="Напиши сообщение")
    bot.register_next_step_handler(message, handle_standup_speech)


def create_err_message(err: Exception) -> str:
    return f"{datetime.now()} ::: {err.__class__} ::: {err}"


while True:
    try:
        bot.setup_resources()
        bot.polling()
    except Exception as err:
        error_message = create_err_message(err)
        bot.telegram_client.post(method="sendMessage", params={"text": error_message,
                                                               "chat_id": ADMIN_CHAT_ID})
        logger.error(error_message)
        bot.shutdown()
