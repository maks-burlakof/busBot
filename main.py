import telebot
from telebot.types import Message
from envparse import Env
from logging import getLogger, config
from datetime import date
from random import choice

from message_texts import *
from clients.telegram_client import TelegramClient
from clients.sqlite3_client import SQLiteClient
from clients.routeby_client import SiteParser
from actioners import UserActioner

config.fileConfig(fname='logging_config.conf', disable_existing_loggers=False)
logger = getLogger(__name__)

env = Env()
TOKEN = env.str('TOKEN')
ADMIN_CHAT_ID = env.str('ADMIN_CHAT_ID')


class MyBot(telebot.TeleBot):
    def __init__(self, telegram_client: TelegramClient, user_actioner: UserActioner,
                 parser: SiteParser, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.telegram_client = telegram_client
        self.user_actioner = user_actioner
        self.parser = parser

    def setup_resources(self):
        self.user_actioner.setup()

    def shutdown_resources(self):
        self.user_actioner.shutdown()

    def shutdown(self):
        self.shutdown_resources()


telegram_client = TelegramClient(token=TOKEN, base_url="https://api.telegram.org")
user_actioner = UserActioner(SQLiteClient("users.db"))
parser = SiteParser()
bot = MyBot(token=TOKEN, telegram_client=telegram_client, user_actioner=user_actioner, parser=parser)


@bot.message_handler(commands=['start'])
def start(message: Message):
    user_id = message.from_user.id
    username = message.from_user.username
    chat_id = message.chat.id

    user = bot.user_actioner.get_user(user_id=str(user_id))
    if not user:
        bot.user_actioner.create_user(user_id=str(user_id), username=username, chat_id=chat_id)
        bot.send_message(message.chat.id, START_NEW_USER_MSG % message.from_user.first_name, parse_mode='Markdown')
        logger.info(f'User @{username} is registered')
    else:
        bot.send_message(message.chat.id, START_OLD_USER_MSG)
    bot.send_message(message.chat.id, START_FEATURES_MSG, parse_mode='Markdown')


@bot.message_handler(commands=["notify"])
def notify(message: Message):
    bot.send_message(message.chat.id, NOTIFY_INPUT_MSG)
    bot.register_next_step_handler(message, notify_set)


def notify_set(message: Message):
    notify_data = message.text.strip(' ')
    if not bot.parser.is_input_correct(date=notify_data):
        bot.send_message(message.chat.id, choice(NO_BUSES_MSGS))
        return
    bot.user_actioner.update_notify_data(user_id=str(message.from_user.id), updated_date=notify_data)
    bot.send_message(message.chat.id, choice(NOTIFY_TRACK_SET_MSGS))


@bot.message_handler(commands=["parse"])
def parse(message: Message):
    bot.send_message(message.chat.id, PARSE_INPUT_MSG)
    bot.register_next_step_handler(message, parse_response)


def parse_response(message: Message):
    bot.delete_message(message.chat.id, message.id - 1)
    bot.send_message(message.chat.id, choice(LOADING_MSGS))
    city_from, city_to, departure_date = message.text.split(' ')
    if not bot.parser.is_input_correct(date=departure_date):
        bot.edit_message_text(choice(NO_BUSES_MSGS), message.chat.id, message.id + 1)
        return
    response = bot.parser.parse(city_from, city_to, departure_date)
    if response:
        bot.edit_message_text(str(response), message.chat.id, message.id + 1)
    else:
        bot.edit_message_text(choice(NO_BUSES_MSGS), message.chat.id, message.id + 1)


@bot.message_handler(commands=["track"])
def track(message: Message):
    bot.send_message(message.chat.id, TRACK_INPUT_MSG)
    bot.register_next_step_handler(message, track_set)


def track_set(message: Message):
    bot.send_message(message.chat.id, choice(LOADING_MSGS))
    track_data = message.text.split(' ')
    if not bot.parser.is_input_correct(track_data[0], track_data[1], track_data[2], track_data[3]):
        bot.edit_message_text(choice(NO_BUSES_MSGS), message.chat.id, message.id + 1)
        return
    bot.user_actioner.update_track_data(user_id=str(message.from_user.id), updated_date=" ".join(track_data))
    bot.edit_message_text(choice(NOTIFY_TRACK_SET_MSGS), message.chat.id, message.id + 1)


@bot.message_handler(commands=["settings"])
def settings(message: Message):
    bot.send_message(message.chat.id, FEATURE_NOT_ADDED)


@bot.message_handler(commands=["extra"])
def extra(message: Message):
    bot.send_message(message.chat.id,
                     EXTRA_MSG + EXTRA_ADMIN_MSG if message.chat.id == int(ADMIN_CHAT_ID) else EXTRA_MSG,
                     parse_mode='HTML')


@bot.message_handler(commands=["description"])
def description(message: Message):
    bot.send_message(message.chat.id, DESCRIPTION_MSG, parse_mode='Markdown')


@bot.message_handler(commands=["feedback"])
def feedback(message: Message):
    bot.reply_to(message, FEEDBACK_MSG)
    bot.register_next_step_handler(message, feedback_speech)


def feedback_speech(message: Message):
    bot.send_message(ADMIN_CHAT_ID, FEEDBACK_TO_ADMIN_MSG % (message.from_user.username, message.text))
    bot.reply_to(message, FEEDBACK_SUBMIT_MSG)


@bot.message_handler(commands=["announcement_text"])
def announcement_text(message: Message):
    if not is_admin(message):
        return
    bot.send_message(message.chat.id, ANNOUNCEMENT_TEXT_INPUT_MSG)
    bot.register_next_step_handler(message, announcement_text_speech)


def announcement_text_speech(message: Message):
    bot.reply_to(message, ANNOUNCEMENT_TEXT_CONFIRMATION_MSG)
    bot.register_next_step_handler(message, announcement_text_confirmation, message.text)


def announcement_text_confirmation(message: Message, ann_text: str):
    if message.text.title().strip() == "Да":
        bot.send_message(message.chat.id, ANNOUNCEMENT_TEXT_SENT_MSG)
        users = bot.user_actioner.get_all_users()
        for user in users:
            bot.send_message(user[1], ANNOUNCEMENT_TEXT % ann_text, parse_mode='Markdown')
    else:
        bot.send_message(message.chat.id, ANNOUNCEMENT_TEXT_CANCELED_MSG)


@bot.message_handler(commands=["announcement_auto"])
def announcement_auto(message: Message):
    if not is_admin(message):
        return
    bot.send_message(message.chat.id, FEATURE_NOT_ADDED)


def create_err_message(err: Exception) -> str:
    return f"{date.today()} ::: {err.__class__} ::: {err}"


def is_admin(message):
    if message.chat.id != int(ADMIN_CHAT_ID):
        bot.send_message(message.chat.id, NO_RIGHTS_MSG)
        return False
    else:
        return True


while True:
    try:
        bot.setup_resources()
        bot.polling()
    except Exception as err:
        bot.telegram_client.post(method="sendMessage", params={"text": create_err_message(err),
                                                               "chat_id": ADMIN_CHAT_ID})
        logger.error(f"{err.__class__} - {err}")
        bot.shutdown()
