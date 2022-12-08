import telebot
from telebot.types import Message
from envparse import Env
from logging import getLogger, config
from datetime import date

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
    create_new_user = False

    user = bot.user_actioner.get_user(user_id=str(user_id))
    if not user:
        bot.user_actioner.create_user(user_id=str(user_id), username=username, chat_id=chat_id)
        create_new_user = True
    # TODO: Показывать также возможности бота
    bot.reply_to(message=message, text=f"Вы {'уже' if not create_new_user else 'успешно'} зарегистрированы: {username}.\n"
                                       f"Ваш user_id: {user_id}")
    logger.info(f'User @{username} called /start function')


@bot.message_handler(commands=["notify"])
def notify(message: Message):
    bot.send_message(message.chat.id, 'Введите через пробел город отправления, город прибытия, дату в формате "2023-01-13"')
    bot.register_next_step_handler(message, notify_set)


def notify_set(message: Message):
    notify_data = message.text.split(' ')
    bot.user_actioner.update_notify_data(user_id=str(message.from_user.id), updated_date=notify_data)
    bot.send_message(message.chat.id, 'Отлично! Я пришлю тебе уведомление, когда появятся рейсы на эту дату.')


@bot.message_handler(commands=["parse"])
def parse(message: Message):
    bot.send_message(message.chat.id, 'Введите через пробел город отправления, город прибытия, дату в формате "2023-01-13"')
    bot.register_next_step_handler(message, parse_response)


def parse_response(message: Message):
    city_from, city_to, departure_date = message.text.split(' ')
    response = bot.parser.parse(city_from, city_to, departure_date)
    if response:
        bot.send_message(message.chat.id, str(response))
    else:
        bot.send_message(message.chat.id, "Рейсов на этот день не найдено.")


@bot.message_handler(commands=["track"])
def track(message: Message):
    bot.send_message(message.chat.id, 'Отправьте через пробел город отправления, город прибытия, '
                                      'дату в формате "2023-01-13" и время отправления рейса')
    bot.register_next_step_handler(message, track_set)


def track_set(message: Message):
    track_data = message.text.split(' ')
    bot.user_actioner.update_track_data(user_id=str(message.from_user.id), updated_date=track_data)
    bot.send_message(message.chat.id, 'Отлично! Я пришлю тебе уведомление, когда появятся свободные места на этот рейс.')


@bot.message_handler(commands=["settings"])
def settings(message: Message):
    pass


@bot.message_handler(commands=["extra"])
def extra(message: Message):
    msg = "Дополнительные возможности:\n"\
          "/description - Описание проекта\n"\
          "/feedback - Отправка сообщения администратору\n"
    if message.chat.id == int(ADMIN_CHAT_ID):
        msg+= "/announcement_text - Объявление (текстовое) для пользователей\n" \
              "/announcement_auto - Объявление (с форматированием) для пользователей\n"
    bot.send_message(message.chat.id, msg)


@bot.message_handler(commands=["description"])
def description(message: Message):
    bot.send_message(message.chat.id, '[Смотреть README.md на GitHub](https://github.com/'
                                      'maks-burlakof/bus_bot/blob/main/README.md)', parse_mode='Markdown')


@bot.message_handler(commands=["feedback"])
def feedback(message: Message):
    bot.reply_to(message, text="Отправьте сообщение администратору:")
    bot.register_next_step_handler(message, feedback_speech)


def feedback_speech(message: Message):
    bot.send_message(ADMIN_CHAT_ID, f"Пользователь @{message.from_user.username} "
                                    f"отправил сообщение:\n{message.text}")
    bot.reply_to(message, "Ваше сообщение отправлено")


@bot.message_handler(commands=["announcement_text"])
def announcement_text(message: Message):
    if not is_admin(message):
        return
    bot.send_message(message.chat.id, "Введите текст объявления, которое будет отправлено всем пользователям")
    bot.register_next_step_handler(message, announcement_text_speech)


def announcement_text_speech(message: Message):
    bot.reply_to(message, "Вы уверены, что хотите отправить это объявление всем пользователям?\nДа/Нет")
    bot.register_next_step_handler(message, announcement_text_confirmation, message.text)


def announcement_text_confirmation(message: Message, ann_text: str):
    if message.text.title().strip() == "Да":
        bot.send_message(message.chat.id, "Объявление отправлено всем участникам")
        users = bot.user_actioner.get_all_users()
        for user in users:
            bot.send_message(user[1], "*🔔 Объявление:*\n" + ann_text, parse_mode='Markdown')
    else:
        bot.send_message(message.chat.id, "Отправка объявления отменена")


@bot.message_handler(commands=["announcement_auto"])
def announcement_auto(message: Message):
    if not is_admin(message):
        return


def create_err_message(err: Exception) -> str:
    return f"{date.today()} ::: {err.__class__} ::: {err}"


def is_admin(message):
    if message.chat.id != int(ADMIN_CHAT_ID):
        bot.send_message(message.chat.id, "У вас нет прав на использование этой команды.")
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
