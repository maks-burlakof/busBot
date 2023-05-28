from datetime import date, datetime
from random import choice, sample
from string import ascii_letters, digits
from sys import exit
from os import environ
import locale
from logging import getLogger, config
import telebot
from telebot.types import Message, CallbackQuery, ReplyKeyboardRemove

from workers.reminder import TIME_DELTA
from message_texts import *
from clients import *
from actioners import UserActioner
from inline_markups import CityMarkup, DepartureTimeMarkup, ChangeValueMarkup, BuyTicketMarkup, Calendar, CallbackData

locale.setlocale(locale.LC_ALL, ('ru_RU', 'UTF-8'))

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
parser = SiteParser(user_actioner)
bot = MyBot(token=TOKEN, telegram_client=telegram_client, user_actioner=user_actioner, parser=parser)

calendar = Calendar()
calendar_callback = CallbackData("calendar", "action", "year", "month", "day")
city_markup = CityMarkup(user_actioner)
departure_time_markup = DepartureTimeMarkup(parser=parser)
buy_ticket_markup = BuyTicketMarkup()
change_value_markup = ChangeValueMarkup()


def is_allowed_user(message: Message, is_silent=False):
    if bot.user_actioner.is_user_active(message.from_user.id):
        return True
    else:
        if not is_silent:
            bot.send_message(message.chat.id, choice(USER_NOT_ALLOWED_MSG))
        return False


def is_admin(message: Message):
    if message.chat.id == int(ADMIN_CHAT_ID):
        return True
    else:
        bot.send_message(message.chat.id, NO_RIGHTS_MSG)
        return False


@bot.message_handler(commands=['start'], func=is_allowed_user)
def start(message: Message):
    user_id = message.from_user.id
    username = message.from_user.username
    chat_id = message.chat.id
    user = bot.user_actioner.get_user(user_id)
    if not user:
        bot.send_sticker(message.chat.id, 'CAACAgIAAxkBAAEG0ZJjmPVT7_NYus3XFkwVDIaW0hQ7gwACpgwAAl3b6EuwssAGdg1yFSwE')
        bot.user_actioner.add_active_user(user_id=str(user_id), username=username, chat_id=chat_id)
        bot.send_message(message.chat.id, START_NEW_USER_MSG % message.from_user.first_name, parse_mode='Markdown')
        logger.info(f'User @{username} is registered')
    else:
        bot.send_sticker(message.chat.id, 'CAACAgIAAxkBAAEHyYRj779lyclNKRBYMp55szX19d7MDgACWxkAApITQEg3UQr5oSE8ny4E')
    bot.send_message(message.chat.id, START_FEATURES_MSG, parse_mode='Markdown')


@bot.message_handler(commands=["notify"], func=is_allowed_user)
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


@bot.message_handler(commands=["parse"], func=is_allowed_user)
def parse(message: Message):
    bot.send_message(message.chat.id, PARSE_INPUT_MSG,
                     reply_markup=calendar.create_calendar(name=calendar_callback.prefix))


@bot.message_handler(commands=["track"], func=is_allowed_user)
def track(message: Message):
    track_data = bot.user_actioner.get_user(message.from_user.id)[4]
    if track_data:
        track_data = track_data.split(' ')
        try:
            y, m, d = [int(i) for i in track_data[0].split('-')]
            track_date = date(y, m, d)
            response_text = TRACK_EXISTS_MSG % (track_date.strftime('%d %B %Yг. (%a)'),
                                                track_data[1], track_data[2], track_data[3])
            same_count = bot.user_actioner.same_track_data_count(f"{track_data[0]} {track_data[1]} {track_data[2]} {track_data[3]}")
            response_text += f'\nС тобой рейс отслеживают {same_count} человек' if same_count > 0 else ""
            bot.send_message(message.chat.id, response_text, reply_markup=change_value_markup.create())
        except (IndexError, ValueError):
            bot.user_actioner.update_track_data(message.from_user.id, None)
            track(message)
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
    elif action == 'RESET':
        if call.message.text[:call.message.text.find('\n')] == NOTIFY_EXISTS_MSG[:NOTIFY_EXISTS_MSG.find('\n')]:
            bot.user_actioner.update_notify_date(call.from_user.id, None)
            bot.send_message(call.from_user.id, choice(NOTIFY_RESET_EXISTS_MSGS), reply_markup=ReplyKeyboardRemove())
        elif call.message.text[:call.message.text.find('\n')] == TRACK_EXISTS_MSG[:TRACK_EXISTS_MSG.find('\n')]:
            bot.user_actioner.update_track_data(call.from_user.id, None)
            bot.send_message(call.from_user.id, choice(TRACK_RESET_EXISTS_MSGS), reply_markup=ReplyKeyboardRemove())
    elif action == 'CANCEL':
        pass


@bot.callback_query_handler(func=lambda call: call.data.startswith(calendar_callback.prefix))
def callback_inline_single_calendar(call: CallbackQuery):
    name, action, year, month, day = call.data.split(calendar_callback.sep)
    chosen_date = calendar.calendar_query_handler(bot, call, name, action, year, month, day)
    if action == "DAY":
        if call.message.text == NOTIFY_INPUT_MSG:
            if (date(int(year), int(month), int(day)) - date.today()).days <= TIME_DELTA:
                bot.send_message(call.from_user.id, choice(NOTIFY_BUS_EXISTS_MSGS))
                return
            bot.user_actioner.update_notify_date(user_id=call.from_user.id, updated_date=chosen_date)
            bot.send_message(call.from_user.id, choice(NOTIFY_TRACK_SET_MSGS), reply_markup=ReplyKeyboardRemove())
            message = call.message
            message.from_user = call.from_user
            notify(message)
            logger.info(f"User {call.from_user.username} set new notify date: {chosen_date}")
        elif call.message.text == TRACK_INPUT_DATE_MSG:
            if (date(int(year), int(month), int(day)) - date.today()).days > TIME_DELTA:
                bot.send_message(call.from_user.id, choice(NO_BUSES_MSGS))
                return
            bot.user_actioner.update_track_data(user_id=call.from_user.id, updated_data=str(chosen_date))
            bot.send_message(call.from_user.id,
                             f'<b>{TRACK_INPUT_ROUTE_MSG}</b>' + SELECTED_DATE_MSG % chosen_date.strftime('%d %B %Yг. (%a)'),
                             parse_mode='HTML',
                             reply_markup=city_markup.create_table())
        elif call.message.text == PARSE_INPUT_MSG:
            if (date(int(year), int(month), int(day)) - date.today()).days > TIME_DELTA:
                bot.send_message(call.from_user.id, choice(NO_BUSES_MSGS))
                return
            bot.user_actioner.update_parse_date(user_id=call.from_user.id, updated_date=chosen_date)
            bot.send_message(call.from_user.id,
                             f'<b>{PARSE_INPUT_ROUTE_MSG}</b>' + SELECTED_DATE_MSG % chosen_date.strftime('%d %B %Yг. (%a)'),
                             parse_mode='HTML',
                             reply_markup=city_markup.create_table())
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
        if call.message.text.split('\n')[0] == TRACK_INPUT_ROUTE_MSG:
            track_date = bot.user_actioner.get_user(call.from_user.id)[4]
            bot.user_actioner.update_track_data(user_id=call.from_user.id,
                                                updated_data=f'{track_date} {city_from} {city_to}')
            d, m, y = [int(i) for i in track_date.split('-')]
            msg = bot.send_message(call.from_user.id, choice(LOADING_MSGS), reply_markup=ReplyKeyboardRemove())
            bot.send_message(call.from_user.id, f'<b>{TRACK_INPUT_DEPARTURE_TIME_MSG}</b>' +
                             SELECTED_DATE_MSG % date(d, m, y).strftime('%d %B %Yг. (%a)') +
                             SELECTED_ROUTE_MSG % (city_from, city_to),
                             parse_mode='HTML',
                             reply_markup=departure_time_markup.create_list(city_from, city_to, track_date))
            bot.delete_message(call.from_user.id, msg.id)
        elif call.message.text.split('\n')[0] == PARSE_INPUT_ROUTE_MSG:
            msg = bot.send_message(call.from_user.id, choice(LOADING_MSGS))
            departure_date = bot.user_actioner.get_user(call.from_user.id)[5]
            response = bot.parser.parse(city_from, city_to, departure_date)
            if response:
                stylized = ""
                for bus in response:
                    free_places_info = response[bus]['free_places_info']
                    stylized += f"🕓 {response[bus]['departure_time']} 👉🏻 {response[bus]['arrival_time']} \n" +\
                                ("⛔️ " if 'Нет мест' in free_places_info else "✅ ") + f"{free_places_info} \n" +\
                                (f"💵 {response[bus]['cost']} \n\n" if 'Нет мест' not in free_places_info else '\n')
                bot.edit_message_text(
                    PARSE_RESPONSE_HEADER_MSG %
                    (city_from, city_to, datetime.strptime(f'{departure_date}', '%Y-%m-%d').strftime('%d %B %Yг. (%a)'))
                    + '\n' + stylized, call.message.chat.id, msg.id, parse_mode='Markdown',
                    reply_markup=buy_ticket_markup.create(city_from, city_to, departure_date, parser))
                logger.info(f"User {call.from_user.username} parsed: {departure_date} {city_from} - {city_to}")
            else:
                bot.edit_message_text(choice(NO_BUSES_MSGS), call.message.chat.id, msg.id)


@bot.callback_query_handler(func=lambda call: call.data.startswith(departure_time_markup.prefix))
def callback_inline_departure_time(call: CallbackQuery):
    name, departure_time, free_places = call.data.split(departure_time_markup.sep)
    track_data = bot.user_actioner.get_user(call.from_user.id)[4]
    bot.delete_message(chat_id=call.message.chat.id, message_id=call.message.id)
    try:
        departure_date, city_from, city_to = track_data.split(' ')
        y, m, d = [int(i) for i in departure_date.split('-')]
    except (IndexError, ValueError, AttributeError):
        return
    if 'Нет мест' in free_places:
        bot.user_actioner.update_track_data(call.from_user.id, f'{track_data} {departure_time}')
        bot.send_message(call.from_user.id, choice(NOTIFY_TRACK_SET_MSGS), reply_markup=ReplyKeyboardRemove())
        message = call.message
        message.from_user = call.from_user
        track(message)
        logger.info(f"User {call.from_user.username} set new track data: {track_data} {departure_time}")
    else:
        bot.send_message(call.from_user.id, choice(TRACK_FREE_PLACES_EXISTS_MSGS),
                         reply_markup=buy_ticket_markup.create(city_from, city_to, departure_date, parser))
        bot.user_actioner.update_track_data(call.from_user.id, None)


@bot.message_handler(commands=["settings"], func=is_allowed_user)
def settings(message: Message):
    bot.send_message(message.chat.id, FEATURE_NOT_ADDED_MSGS)


@bot.message_handler(commands=["extra"])
def extra(message: Message):
    bot.send_message(message.chat.id,
                     EXTRA_MSG + EXTRA_ADMIN_MSG if message.chat.id == int(ADMIN_CHAT_ID) else EXTRA_MSG,
                     parse_mode='HTML')


@bot.message_handler(commands=["description"])
def description(message: Message):
    bot.send_message(message.chat.id, DESCRIPTION_MSG, parse_mode='Markdown')
    if not is_allowed_user(message, is_silent=True):
        return
    users = bot.user_actioner.get_all_users()
    user_count = len(users)
    notify_count = user_count - [user[3] for user in users].count(None)
    track_count = user_count - [user[4] for user in users].count(None)
    bot.send_message(message.chat.id, STATISTICS_MSG % (len(users), notify_count, track_count),
                     parse_mode='Markdown')


@bot.message_handler(commands=["faq"], func=is_allowed_user)
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
        bot.send_message(ADMIN_CHAT_ID, '#INFO:' + FEEDBACK_TO_ADMIN_MSG % (message.from_user.username, feedback_text))
        bot.reply_to(message, FEEDBACK_SUBMIT_MSG)
        logger.info(f'User @{message.from_user.username} sent feedback: {feedback_text}')
    else:
        bot.send_message(message.chat.id, choice(CANCEL_MSGS))


@bot.message_handler(commands=["announcement_text"], func=is_admin)
def announcement_text(message: Message):
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
            bot.send_message(user[2], ANNOUNCEMENT_TEXT_MSG % ann_text, parse_mode='Markdown')
    else:
        bot.send_message(message.chat.id, choice(CANCEL_MSGS))


@bot.message_handler(commands=["announcement_auto"], func=is_admin)
def announcement_auto(message: Message):
    bot.send_message(message.chat.id, FEATURE_NOT_ADDED_MSGS)


@bot.message_handler(commands=["users"], func=is_admin)
def users_list(message: Message):
    users = bot.user_actioner.get_all_users()
    response = ''
    for user in users:
        if not bot.user_actioner.is_user_active(user[0]):
            response += '❌ '
        response += '{} - @{}\n'.format(user[0], user[1])
    bot.send_message(message.chat.id, USER_LIST_MSG + response, parse_mode='HTML')


@bot.message_handler(commands=["ban"], func=is_admin)
def ban_user(message: Message):

    def ban_user_confirmation(msg):
        if 'Отменить' in msg.text:
            bot.send_message(msg.chat.id, choice(CANCEL_MSGS))
            return

        try:
            blocking_id = int(msg.text)
        except ValueError:
            return
        users = bot.user_actioner.get_all_users()
        for user in users:
            if user[0] == blocking_id:
                bot.user_actioner.make_user_inactive(blocking_id)
                username = '@{}'.format(user[1]) if user[1] else ' '
                bot.send_message(msg.chat.id, BAN_USER_CONFIRMATION_MSG % username)
                break

    bot.send_message(message.chat.id, BAN_USER_MSG, parse_mode='MarkdownV2')
    users_list(message)
    bot.register_next_step_handler(message, ban_user_confirmation)


@bot.message_handler(commands=["database"], func=is_admin)
def database_view(message: Message):
    users = bot.user_actioner.get_all_users()
    response = ''
    for user in users:
        if user[3]:
            response += f'@{user[1]}\n1️⃣ {user[3]}\n'
            if user[4]:
                response += f'2️⃣ {user[4]}\n'
        elif user[4]:
            response += f'@{user[1]}\n2️⃣ {user[4]}\n'
    bot.send_message(message.chat.id, DATABASE_LIST_MSG + response, parse_mode='HTML')


@bot.message_handler(commands=["exit"], func=is_admin)
def exit_bot(message: Message):
    bot.send_message(message.chat.id, EXIT_CONFIRMATION_MSG, parse_mode='Markdown')
    bot.register_next_step_handler(message, exit_bot_confirmation)


def exit_bot_confirmation(message: Message):
    if message.text.title().strip() == 'Выключение':
        bot.send_message(message.chat.id, EXIT_MSG)
        logger.critical(f'The bot was disabled at the initiative of the administrator @{message.from_user.username}')
        bot.stop_bot()
    else:
        bot.send_message(message.chat.id, choice(CANCEL_MSGS))


@bot.message_handler(commands=["register"])
def register(message: Message):
    bot.send_message(message.chat.id, REGISTER_MSG)
    bot.register_next_step_handler(message, register_confirmation)


def register_confirmation(message: Message):
    code = message.text.strip(' ')
    codes = bot.user_actioner.get_invite_codes()
    if (code,) not in codes:
        bot.send_message(message.chat.id, REGISTER_CODE_INCORRECT_MSG)
        return
    else:
        bot.user_actioner.remove_invite_code(code)
        logger.info(f"User @{message.from_user.username} used an invitation code")
        bot.send_message(ADMIN_CHAT_ID, f'#INFO Пользователь @{message.from_user.username} '
                                        f'использовал пригласительный код')
        bot.send_message(message.chat.id, REGISTER_CODE_CORRECT_MSG)
        start(message)
        bot.user_actioner.make_user_active(message.from_user.id)


@bot.message_handler(commands=["invite_codes"], func=is_admin)
def send_invite_codes(message: Message):
    codes = bot.user_actioner.get_invite_codes()
    msg = "\n".join(f"`{code[0]}`" for code in codes)
    bot.send_message(message.chat.id, msg, parse_mode='MarkdownV2')


@bot.message_handler(commands=["invite_codes_create"], func=is_admin)
def create_invite_codes(message: Message):
    symbols = ascii_letters + digits
    for _ in range(5):
        bot.user_actioner.add_invite_code(''.join(sample(symbols, k=20)))
    bot.send_message(message.chat.id, INVITE_CODES_CREATED_MSG)


@bot.message_handler(commands=["logs"], func=is_admin)
def send_logs(message: Message):
    with open('logs.log', 'rb') as f:
        try:
            bot.send_document(message.chat.id, document=f, caption="#LOGS")
        except telebot.apihelper.ApiTelegramException:
            bot.send_message(message.chat.id, 'Файл логов пуст')


@bot.message_handler(commands=["clear_logs"], func=is_admin)
def clear_logs(message: Message):
    send_logs(message)
    with open('logs.log', 'w') as f:
        f.write('')


@bot.message_handler(commands=["secret"])
def secret(message: Message):
    bot.send_message(message.chat.id, SECRET_MSG, parse_mode='MarkdownV2')
    bot.send_message(ADMIN_CHAT_ID, f'#INFO: @{message.from_user.username} отправил /secret')


@bot.message_handler()
def ordinary_text(message: Message):
    if is_allowed_user(message, is_silent=True):
        bot.send_message(message.chat.id, choice(ORDINARY_TEXT_MSGS))


while True:
    try:
        bot.setup_resources()
        bot.polling()
    except RuntimeError:
        exit()
    except Exception as err:
        bot.telegram_client.post(method="sendMessage",
                                 params={"text": f"#ERROR: {date.today()} ::: {err.__class__} ::: {err}",
                                         "chat_id": ADMIN_CHAT_ID})
        logger.error(f"{err.__class__} - {err}")
        bot.shutdown()
