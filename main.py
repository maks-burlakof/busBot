import telebot
from telebot.types import Message
import json
from envparse import Env
from datetime import datetime
from clients.telegram_client import TelegramClient

env = Env()
TOKEN = env.str('TOKEN')
ADMIN_CHAT_ID = env.str('ADMIN_CHAT_ID')


class MyBot(telebot.TeleBot):
    def __init__(self, telegram_client: TelegramClient, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.telegram_client = telegram_client


telegram_client = TelegramClient(token=TOKEN, base_url="https://api.telegram.org")
bot = MyBot(token=TOKEN, telegram_client=telegram_client)


@bot.message_handler(commands=['start'])
def start(message: Message):
    with open('users.json', 'r') as f:  # users.json must be in folder
        data_from_json = json.load(f)

    user_id = message.from_user.id
    username = message.from_user.username

    if str(user_id) not in data_from_json:
        data_from_json[user_id] = {'username': username}
        with open('users.json', 'w') as f:
            json.dump(data_from_json, f, indent=4, ensure_ascii=False)

    bot.reply_to(message, f'Вы зарегистрированы: {username}.\n'
                                 f'Ваш user_id: {user_id}.')


def handle_standup_speech(message: Message):
    bot.reply_to(message, "Ответ готов!")


@bot.message_handler(commands=["say_standup_speech"])
def say_standup_speech(message: Message):
    bot.reply_to(message, text="Напиши сообщение")
    bot.register_next_step_handler(message, handle_standup_speech)


def create_err_message(err: Exception) -> str:
    return f"{datetime.now()} ::: {err.__class__} ::: {err}"


while True:
    try:
        bot.polling()
    except Exception as err:
        bot.telegram_client.post(method="sendMessage", params={"text": create_err_message(err),
                                                               "chat_id": ADMIN_CHAT_ID})
