import telebot
from telebot.types import Message, CallbackQuery, ReplyKeyboardRemove
from logging import getLogger, config
from datetime import date
from random import choice
from sys import exit
from os import environ
import locale

from message_texts import *
from clients import *
from actioners import UserActioner
from inline_markups import CityMarkup, DepartureTimeMarkup, ChangeValueMarkup, Calendar, CallbackData, RUSSIAN_LANGUAGE

locale.setlocale(locale.LC_ALL, '')

config.fileConfig(fname='logging_config.conf', disable_existing_loggers=False)
logger = getLogger(__name__)

TOKEN = environ.get('TOKEN')
ADMIN_CHAT_ID = environ.get('ADMIN_CHAT_ID')


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

calendar = Calendar(language=RUSSIAN_LANGUAGE)
calendar_callback = CallbackData("calendar", "action", "year", "month", "day")
city_markup = CityMarkup()
departure_time_markup = DepartureTimeMarkup(parser=parser)
change_value_markup = ChangeValueMarkup()


@bot.message_handler(commands=['start'])
def start(message: Message):
    user_id = message.from_user.id
    username = message.from_user.username
    chat_id = message.chat.id

    user = bot.user_actioner.get_user(user_id)
    if not user:
        bot.send_sticker(message.chat.id, 'CAACAgIAAxkBAAEG0ZJjmPVT7_NYus3XFkwVDIaW0hQ7gwACpgwAAl3b6EuwssAGdg1yFSwE')
        bot.user_actioner.create_user(user_id=str(user_id), username=username, chat_id=chat_id)
        bot.send_message(message.chat.id, START_NEW_USER_MSG % message.from_user.first_name, parse_mode='Markdown')
        logger.info(f'User @{username} is registered')
    else:
        bot.send_message(message.chat.id, START_OLD_USER_MSG)
    bot.send_message(message.chat.id, START_FEATURES_MSG, parse_mode='Markdown')


@bot.message_handler(commands=["notify"])
def notify(message: Message):
    notify_date = bot.user_actioner.get_user(message.from_user.id)[3]
    if notify_date:
        d, m, y = [int(i) for i in notify_date.split('-')]
        notify_date = date(d, m, y)
        bot.send_message(message.chat.id, NOTIFY_EXISTS_MSG % notify_date.strftime('%d %B %Yг. (%a)'),
                         reply_markup=change_value_markup.create())
    else:
        bot.send_message(message.chat.id, NOTIFY_INPUT_MSG,
                         reply_markup=calendar.create_calendar(name=calendar_callback.prefix))


@bot.message_handler(commands=["parse"])
def parse(message: Message):
    bot.send_message(message.chat.id, PARSE_INPUT_MSG,
                     reply_markup=calendar.create_calendar(name=calendar_callback.prefix))


@bot.message_handler(commands=["track"])
def track(message: Message):
    track_data = bot.user_actioner.get_user(message.from_user.id)[4]
    if track_data:
        track_data = track_data.split(' ')
        d, m, y = [int(i) for i in track_data[0].split('-')]
        track_date = date(d, m, y)
        bot.send_message(message.chat.id, TRACK_EXISTS_MSG % (track_date.strftime('%d %B %Yг. (%a)'),
                                                              track_data[1], track_data[2], track_data[3]),
                         reply_markup=change_value_markup.create())
    else:
        bot.send_message(message.chat.id, TRACK_INPUT_DATE_MSG,
                         reply_markup=calendar.create_calendar(name=calendar_callback.prefix))


@bot.callback_query_handler(func=lambda call: call.data.startswith(change_value_markup.prefix))
def callback_inline_change_value(call: CallbackQuery):
    name, action = call.data.split(calendar_callback.sep)
    bot.delete_message(chat_id=call.message.chat.id, message_id=call.message.id)
    if action == 'CHANGE':
        if call.message.text[:call.message.text.find('\n')] == NOTIFY_EXISTS_MSG[:NOTIFY_EXISTS_MSG.find('\n')]:
            bot.send_message(call.message.chat.id, NOTIFY_INPUT_MSG,
                             reply_markup=calendar.create_calendar(name=calendar_callback.prefix))
        elif call.message.text[:call.message.text.find('\n')] == TRACK_EXISTS_MSG[:TRACK_EXISTS_MSG.find('\n')]:
            bot.send_message(call.message.chat.id, TRACK_INPUT_DATE_MSG,
                             reply_markup=calendar.create_calendar(name=calendar_callback.prefix))
    elif action == 'CANCEL':
        bot.send_message(call.from_user.id, choice(CANCEL_MSGS), reply_markup=ReplyKeyboardRemove())


@bot.callback_query_handler(func=lambda call: call.data.startswith(calendar_callback.prefix))
def callback_inline_single_calendar(call: CallbackQuery):
    name, action, year, month, day = call.data.split(calendar_callback.sep)
    chosen_date = calendar.calendar_query_handler(bot, call, name, action, year, month, day)

    if action == "DAY":
        # TODO: не выводить в календаре прошлые даты и не нужна будет эта проверка
        if not bot.parser.is_input_correct(date=chosen_date):
            bot.send_message(call.from_user.id, choice(NO_BUSES_MSGS), reply_markup=ReplyKeyboardRemove())
            return
        if call.message.text == NOTIFY_INPUT_MSG:
            bot.user_actioner.update_notify_date(user_id=call.from_user.id, updated_date=chosen_date)
            bot.send_message(call.from_user.id, choice(NOTIFY_TRACK_SET_MSGS), reply_markup=ReplyKeyboardRemove())
        elif call.message.text == TRACK_INPUT_DATE_MSG:
            bot.user_actioner.update_track_data(user_id=call.from_user.id, updated_data=str(chosen_date))
            bot.send_message(call.from_user.id, TRACK_INPUT_ROUTE_MSG, reply_markup=city_markup.create_table())
        elif call.message.text == PARSE_INPUT_MSG:
            bot.user_actioner.update_parse_date(user_id=call.from_user.id, updated_date=chosen_date)
            bot.send_message(call.from_user.id, PARSE_INPUT_ROUTE_MSG, reply_markup=city_markup.create_table())
    elif action == "CANCEL":
        bot.send_message(call.from_user.id, choice(CANCEL_MSGS), reply_markup=ReplyKeyboardRemove())


@bot.callback_query_handler(func=lambda call: call.data.startswith(city_markup.prefix))
def callback_inline_cities(call: CallbackQuery):
    name, action, city_from, city_to = call.data.split(city_markup.sep)
    if action == 'SET':
        bot.edit_message_reply_markup(call.message.chat.id, call.message.id,
                                      reply_markup=city_markup.create_table(city_from=city_from, city_to=city_to))
    elif action == 'SUBMIT':
        bot.delete_message(chat_id=call.message.chat.id, message_id=call.message.id)
        if call.message.text == TRACK_INPUT_ROUTE_MSG:
            track_date = bot.user_actioner.get_user(call.from_user.id)[4]
            bot.user_actioner.update_track_data(user_id=call.from_user.id,
                                                updated_data=f'{track_date} {city_from} {city_to}')
            msg = bot.send_message(call.from_user.id, choice(LOADING_MSGS), reply_markup=ReplyKeyboardRemove())
            bot.send_message(call.from_user.id, TRACK_INPUT_DEPARTURE_TIME,
                             reply_markup=departure_time_markup.create_list(city_from, city_to, track_date))
            bot.delete_message(call.from_user.id, msg.id)
        elif call.message.text == PARSE_INPUT_ROUTE_MSG:
            msg = bot.send_message(call.from_user.id, choice(LOADING_MSGS))
            departure_date = bot.user_actioner.get_user(call.from_user.id)[5]
            response = bot.parser.parse(city_from, city_to, departure_date)
            if response:
                bot.edit_message_text(PARSE_RESPONSE_HEADER_MSG % (city_from, city_to, departure_date) + str(response),
                                      call.message.chat.id, msg.id, parse_mode='Markdown')
            else:
                bot.edit_message_text(choice(NO_BUSES_MSGS), call.message.chat.id, msg.id)


@bot.callback_query_handler(func=lambda call: call.data.startswith(departure_time_markup.prefix))
def callback_inline_departure_time(call: CallbackQuery):
    name, departure_time = call.data.split(departure_time_markup.sep)
    bot.delete_message(chat_id=call.message.chat.id, message_id=call.message.id)
    track_data = bot.user_actioner.get_user(call.from_user.id)[4]
    bot.user_actioner.update_track_data(user_id=call.from_user.id, updated_data=f'{track_data} {departure_time}')
    bot.send_message(call.from_user.id, choice(NOTIFY_TRACK_SET_MSGS), reply_markup=ReplyKeyboardRemove())


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
    users = bot.user_actioner.get_all_users()
    user_count = len(users)
    notify_count = user_count - [user[2] for user in users].count(None)
    track_count = user_count - [user[3] for user in users].count(None)
    bot.send_message(message.chat.id, STATISTICS_MSG % (len(users), notify_count, track_count),
                     parse_mode='Markdown')


@bot.message_handler(commands=["faq"])
def faq(message: Message):
    bot.send_message(message.chat.id, FAQ_MSG, parse_mode='Markdown')


@bot.message_handler(commands=["feedback"])
def feedback(message: Message):
    bot.reply_to(message, FEEDBACK_MSG)
    bot.register_next_step_handler(message, feedback_speech)


def feedback_speech(message: Message):
    bot.reply_to(message, FEEDBACK_CONFIRMATION_MSG)
    bot.send_message(message.chat.id, FEEDBACK_TO_ADMIN_MSG % (message.from_user.username, message.text))
    bot.register_next_step_handler(message, feedback_confirmation, message.text)


def feedback_confirmation(message: Message, feedback_text: str):
    if message.text.title().strip() == "Отправить":
        bot.send_message(ADMIN_CHAT_ID, FEEDBACK_TO_ADMIN_MSG % (message.from_user.username, feedback_text))
        bot.reply_to(message, FEEDBACK_SUBMIT_MSG)
        logger.info(f'User @{message.from_user.username} sent feedback: {message.text}')
    else:
        bot.send_message(message.chat.id, choice(CANCEL_MSGS))


@bot.message_handler(commands=["announcement_text"])
def announcement_text(message: Message):
    if not is_admin(message):
        return
    bot.send_message(message.chat.id, ANNOUNCEMENT_TEXT_INPUT_MSG)
    bot.register_next_step_handler(message, announcement_text_speech)


def announcement_text_speech(message: Message):
    bot.reply_to(message, ANNOUNCEMENT_TEXT_CONFIRMATION_MSG)
    bot.send_message(message.chat.id, ANNOUNCEMENT_TEXT_MSG % message.text, parse_mode='Markdown')
    bot.register_next_step_handler(message, announcement_text_confirmation, message.text)


def announcement_text_confirmation(message: Message, ann_text: str):
    if message.text.title().strip() == "Отправить":
        bot.send_message(message.chat.id, ANNOUNCEMENT_TEXT_SENT_MSG)
        users = bot.user_actioner.get_all_users()
        for user in users:
            bot.send_message(user[1], ANNOUNCEMENT_TEXT_MSG % ann_text, parse_mode='Markdown')
    else:
        bot.send_message(message.chat.id, choice(CANCEL_MSGS))


@bot.message_handler(commands=["announcement_auto"])
def announcement_auto(message: Message):
    if not is_admin(message):
        return
    bot.send_message(message.chat.id, FEATURE_NOT_ADDED)


@bot.message_handler(commands=["users"])
def users_list(message: Message):
    if not is_admin(message):
        return
    users = bot.user_actioner.get_all_users()
    response = "@"
    response += "\n@".join([user[0] for user in users])
    bot.send_message(message.chat.id, USER_LIST + response, parse_mode='HTML')


@bot.message_handler(commands=["exit"])
def exit_bot(message: Message):
    if not is_admin(message):
        return
    bot.send_message(message.chat.id, EXIT_CONFIRMATION_MSG, parse_mode='Markdown')
    bot.register_next_step_handler(message, exit_bot_confirmation)


def exit_bot_confirmation(message: Message):
    if message.text.title().strip() == 'Выключение':
        bot.send_message(message.chat.id, EXIT_MSG)
        logger.critical(f'The bot was disabled at the initiative of the administrator @{message.from_user.username}')
        exit()
    else:
        bot.send_message(message.chat.id, choice(CANCEL_MSGS))


@bot.message_handler(commands=["secret"])
def secret(message: Message):
    bot.send_message(message.chat.id, SECRET_MSG, parse_mode='Markdown')
    bot.send_message(ADMIN_CHAT_ID, f'@{message.from_user.username} отправил |/secret|', parse_mode='Markdown')


@bot.message_handler()
def ordinary_text(message: Message):
    bot.send_message(message.chat.id, choice(ORDINARY_TEXT_MSGS))


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
