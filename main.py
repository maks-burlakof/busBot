from dotenv import load_dotenv
from datetime import date, datetime
from random import choice, sample, randint
from string import ascii_letters, digits
from sys import exit
from os import environ
import locale
from logging import getLogger, config
import telebot
from telebot.types import Message, CallbackQuery, ReplyKeyboardRemove, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardButton

from bot import MyBot
from workers.reminder import TIME_DELTA
from message_texts import *
from clients import *
from actioners import UserActioner
from inline_markups import CityMarkup, DepartureTimeMarkup, ChangeValueMarkup, BuyTicketMarkup, Calendar, CallbackData
from actions import Notify

config.fileConfig(fname='logging_config.conf', disable_existing_loggers=False)
logger = getLogger(__name__)

load_dotenv()
locale.setlocale(locale.LC_ALL, ('ru_RU', 'UTF-8'))
TOKEN = environ.get('TOKEN')
ADMIN_CHAT_ID = environ.get('ADMIN_CHAT_ID')
MAX_BUSES = 3
MAX_PARSE_HISTORY = 3


telegram_client = TelegramClient(token=TOKEN)
user_actioner = UserActioner(SQLiteClient("users.db"))
parser = SiteParser(user_actioner)
bot = MyBot(token=TOKEN, telegram_client=telegram_client, user_actioner=user_actioner, parser=parser)

calendar = Calendar()
calendar_callback = CallbackData("calendar", "action", "year", "month", "day")
city_markup = CityMarkup(user_actioner)
departure_time_markup = DepartureTimeMarkup(parser=parser)
buy_ticket_markup = BuyTicketMarkup()
change_value_markup = ChangeValueMarkup()

notify = Notify(bot, calendar, calendar_callback)


def is_allowed_user(message: Message, is_silent=False):
    if bot.db.is_user_active(message.from_user.id):
        return True
    else:
        if not is_silent:
            bot.send_message(message.chat.id, choice(USER_NOT_ALLOWED_MSG) + USER_NOT_ALLOWED_BASE_MSG,
                             disable_notification=True)
        return False


def is_admin(message: Message):
    if message.chat.id == int(ADMIN_CHAT_ID):
        return True
    else:
        bot.send_message(message.chat.id, NO_RIGHTS_MSG, disable_notification=True)
        return False


@bot.message_handler(commands=['start'], func=is_allowed_user)
def start(message: Message):
    user_id = message.from_user.id
    username = message.from_user.username
    chat_id = message.chat.id
    user = bot.db.get_user(user_id)
    if not user:
        bot.send_sticker(message.chat.id, 'CAACAgIAAxkBAAEG0ZJjmPVT7_NYus3XFkwVDIaW0hQ7gwACpgwAAl3b6EuwssAGdg1yFSwE')
        bot.db.add_active_user(user_id=str(user_id), username=username, chat_id=chat_id)
        bot.send_message(message.chat.id, START_NEW_USER_MSG % message.from_user.first_name, parse_mode='Markdown',
                         disable_notification=True)
        logger.info(f'{message.from_user.full_name} @{username} id:{user_id} is registered')
    else:
        bot.send_sticker(message.chat.id, 'CAACAgIAAxkBAAEHyYRj779lyclNKRBYMp55szX19d7MDgACWxkAApITQEg3UQr5oSE8ny4E')
    bot.send_message(message.chat.id, START_FEATURES_MSG, parse_mode='Markdown', disable_notification=True)


@bot.message_handler(commands=["notify"], func=is_allowed_user)
def notify_start(message: Message):
    notify.notify(message)


@bot.message_handler(commands=["parse"], func=is_allowed_user)
def parse(message: Message):
    user = bot.db.get_user(message.from_user.id)
    if not user:
        return
    bot.db.add_parse_date(message.from_user.id)
    parse_data = user[5]
    if len(parse_data) > MAX_PARSE_HISTORY:
        bot.db.remove_parse_date(message.from_user.id, 0)
        parse_data.pop(0)
    markup = calendar.create_calendar(name=calendar_callback.prefix)
    if parse_data:
        for dict_elem in parse_data:
            y, m, d = [int(j) for j in dict_elem['date'].split('-')]
            parse_date = date(y, m, d)
            if (parse_date - date.today()).days <= TIME_DELTA:
                pretty_str = '📆 {} {} 👉 {}'.format(parse_date.strftime('%d %B (%a)'), dict_elem['from'], dict_elem['to'])
                markup.add(InlineKeyboardButton(pretty_str, callback_data=calendar_callback.sep.join(
                    [calendar_callback.prefix, 'HISTORY_PARSE-{}-{}'.format(dict_elem['from'], dict_elem['to']),
                     str(y), str(m), str(d)])))
    bot.send_message(message.chat.id, PARSE_INPUT_MSG, reply_markup=markup)


@bot.message_handler(commands=["track"], func=is_allowed_user)
def track(message: Message):
    user = bot.db.get_user(message.from_user.id)
    if not user:
        return
    track_data_all = user[4]
    track_data = [dict_elem for dict_elem in track_data_all if dict_elem['is_active'] == '1']
    if track_data:
        len_data = len(track_data)
        markup = change_value_markup.add_create('TRACK', len_data) if len_data < MAX_BUSES else None
        bot.send_message(message.chat.id, TRACK_EXISTS_MSG, reply_markup=markup, parse_mode='Markdown')
        for i in range(len_data):
            y, m, d = [int(j) for j in track_data[i]['date'].split('-')]
            track_date = date(y, m, d)
            response_text = TRACK_BUS_TEMPLATE_MSG % (track_date.strftime('%d %B (%a)'),
                                                      track_data[i]['from'], track_data[i]['to'], track_data[i]['time'])
            same_count = 0  # TODO: bot.db.same_track_data_count()
            response_text += f'\nЭтот рейс отслеживают {same_count} человек' if same_count > 0 else ''  # TODO: правильное склонение
            bot.send_message(message.from_user.id, response_text, reply_markup=change_value_markup.remove_create(
                'TRACK', i, len_data), disable_notification=True)
    else:
        bot.db.add_track_date(message.from_user.id)
        bot.send_message(message.chat.id, TRACK_INPUT_DATE_MSG,
                         reply_markup=calendar.create_calendar(name=calendar_callback.prefix))


@bot.callback_query_handler(func=lambda call: call.data.startswith(notify.markups.prefix))
def notify_callback(call: CallbackQuery):
    callback_data = call.data.split(notify.markups.sep)
    action = callback_data[1]
    index = int(callback_data[2])
    total_num = int(callback_data[3])

    if action == 'ADD':
        notify.add(call)

    elif action == 'REMOVE':
        notify.remove(call, index)

        msg = call.message
        msg.from_user = call.from_user
        notify.notify(msg)

    ids_list = [*range(call.message.id - index - 1, call.message.id),
                *range(call.message.id, call.message.id + total_num - index)]
    bot.delete_messages_safe(call.message.chat.id, ids_list)


# CHANGE VALUE MARKUP
@bot.callback_query_handler(func=lambda call: call.data.startswith(change_value_markup.prefix))
def callback_inline_change_value(call: CallbackQuery):
    user_id = call.from_user.id
    prefix, action, action_type, elem_index, elems_len = call.data.split(change_value_markup.sep)
    elem_index = int(elem_index)
    elems_len = int(elems_len)
    ids_list = [*range(call.message.id - elem_index - 1, call.message.id),
                *range(call.message.id, call.message.id + elems_len - elem_index)]

    if action == 'ADD':
        if action_type == 'TRACK':
            track_data = bot.db.get_user(user_id)[4]
            track_data_active = [dict_elem for dict_elem in track_data if dict_elem['is_active'] == '1']
            if len(track_data_active) < MAX_BUSES:
                bot.db.add_track_date(user_id)
                markup = calendar.create_calendar(name=calendar_callback.prefix)
                for dict_elem in track_data:
                    if dict_elem['is_active'] == '0':
                        y, m, d = dict_elem['date'].split('-')
                        track_date = date(int(y), int(m), int(d))
                        if (track_date - date.today()).days >= 0:
                            pretty_str = '📆 {} {} 👉 {}'.format(track_date.strftime('%d %B (%a)'), dict_elem['from'], dict_elem['to'])
                            markup.add(InlineKeyboardButton(pretty_str, callback_data=calendar_callback.sep.join(
                                [calendar_callback.prefix, 'HISTORY_TRACK-{}'.format(track_data.index(dict_elem)),
                                 str(y), str(m), str(d)])))
                bot.send_message(call.message.chat.id, TRACK_INPUT_DATE_MSG,
                                 reply_markup=markup, disable_notification=True)
            else:
                bot.send_message(call.message.chat.id, notify_track_limit_exceeded_msg(MAX_BUSES),
                                 disable_notification=True)

    elif action == 'RESET':
        message = call.message
        message.from_user = call.from_user

        if action_type == 'TRACK':
            track_data_all = bot.db.get_user(user_id)[4]
            track_data = [dict_elem for dict_elem in track_data_all if dict_elem['is_active'] == '1']
            data_to_remove = track_data[elem_index]
            is_success = bot.db.remove_track_date_by_data(user_id, data_to_remove)
            if is_success:
                y, m, d = data_to_remove['date'].split('-')
                deleted_date = date(int(y), int(m), int(d))
                response = choice(TRACK_RESET_EXISTS_MSGS) + '\n' + TRACK_BUS_TEMPLATE_MSG % (
                    deleted_date.strftime('%d %B (%a)'), data_to_remove['from'],
                    data_to_remove['to'], data_to_remove['time'])
                bot.send_message(user_id, response, reply_markup=ReplyKeyboardRemove(),
                                 disable_notification=True)
            else:
                bot.send_message(user_id, RECORD_NOT_EXISTS_MSGS, disable_notification=True)
            track(message)

    bot.delete_messages_safe(call.message.chat.id, ids_list)


# CALENDAR MARKUP
@bot.callback_query_handler(func=lambda call: call.data.startswith(calendar_callback.prefix))
def callback_inline_single_calendar(call: CallbackQuery):
    user_id = call.from_user.id
    name, action, year, month, day = call.data.split(calendar_callback.sep)
    chosen_date = calendar.calendar_query_handler(bot, call, name, action, year, month, day)

    if action == 'DAY':
        if call.message.text == NOTIFY_INPUT_MSG:
            if (date(int(year), int(month), int(day)) - date.today()).days <= TIME_DELTA:
                bot.send_message(user_id, choice(NOTIFY_BUS_EXISTS_MSGS), disable_notification=True)
                return
            is_unique = bot.db.update_last_notify_date(user_id, 'date', str(chosen_date))
            if is_unique:
                response_msg = choice(NOTIFY_TRACK_SET_MSGS)
                logger.info(f"{call.from_user.full_name} @{call.from_user.username} set new notify date: {chosen_date}")
            else:
                response_msg = choice(NOTIFY_RECORD_EXIST_MSGS)
            bot.send_message(user_id, response_msg, reply_markup=ReplyKeyboardRemove(), disable_notification=True)
            message = call.message
            message.from_user = call.from_user
            notify(message)

        elif call.message.text == TRACK_INPUT_DATE_MSG:
            if (date(int(year), int(month), int(day)) - date.today()).days > TIME_DELTA:
                bot.send_message(user_id, choice(NO_BUSES_MSGS))
                return
            bot.db.update_track_date(user_id, -1, 'date', str(chosen_date))
            bot.send_message(user_id,
                             f'<b>{TRACK_INPUT_ROUTE_MSG}</b>' + SELECTED_DATE_MSG % chosen_date.strftime('%d %B %Yг. (%a)'),
                             parse_mode='HTML', disable_notification=True,
                             reply_markup=city_markup.create_table())

        elif call.message.text == PARSE_INPUT_MSG:
            if (date(int(year), int(month), int(day)) - date.today()).days > TIME_DELTA:
                bot.send_message(user_id, choice(NO_BUSES_MSGS), disable_notification=True)
                return
            bot.db.update_last_parse_data(user_id, 'date', str(chosen_date))
            bot.send_message(user_id,
                             f'<b>{PARSE_INPUT_ROUTE_MSG}</b>' + SELECTED_DATE_MSG % chosen_date.strftime('%d %B %Yг. (%a)'),
                             parse_mode='HTML', disable_notification=True,
                             reply_markup=city_markup.create_table())

    elif 'HISTORY_PARSE' in action:
        parse_data = bot.db.get_user(user_id)[5]
        action_name, city_from, city_to = action.split('-')
        parse_date = date(int(year), int(month), int(day))
        history_record = None
        for dict_record in parse_data:
            if str(parse_date) == dict_record['date'] and city_from == dict_record['from'] and city_to == dict_record['to']:
                history_record = dict_record
                break
        if history_record:
            bot.db.update_last_parse_data(user_id, 'date', history_record['date'])
            call_cities = call
            call_cities.data = city_markup.sep.join(
                [city_markup.prefix, 'SUBMIT', history_record['from'], history_record['to']])
            call_cities.message.text = PARSE_INPUT_ROUTE_MSG
            callback_inline_cities(call_cities)  # emulate user's input
        else:
            bot.send_message(user_id, choice(RECORD_NOT_EXISTS_MSGS), disable_notification=True)

    elif 'HISTORY_TRACK' in action:
        action_name, elem_index = action.split('-')
        elem_index = int(elem_index)
        track_data = bot.db.get_user(user_id)[4]
        try:
            history_record = track_data[elem_index]
        except IndexError:
            bot.send_message(user_id, choice(RECORD_NOT_EXISTS_MSGS), disable_notification=True)
        else:
            bot.db.update_track_date(user_id, -1, 'date', history_record['date'])
            bot.db.update_track_date(user_id, -1, 'from', history_record['from'])
            bot.db.update_track_date(user_id, -1, 'to', history_record['to'])
            call_cities = call
            call_cities.data = city_markup.sep.join(
                [city_markup.prefix, 'SUBMIT', history_record['from'], history_record['to']])
            call_cities.message.text = TRACK_INPUT_ROUTE_MSG
            callback_inline_cities(call_cities)  # emulate user's input

    elif action == 'CANCEL':
        bot.send_message(user_id, choice(CANCEL_MSGS), reply_markup=ReplyKeyboardRemove(), disable_notification=True)
        if call.message.text == NOTIFY_INPUT_MSG:
            bot.db.remove_notify_date(user_id, -1)
        elif call.message.text == TRACK_INPUT_DATE_MSG:
            bot.db.remove_track_date_by_index(user_id, -1)
        elif call.message.text == PARSE_INPUT_MSG:
            bot.db.remove_parse_date(user_id, -1)


# CITY MARKUP
@bot.callback_query_handler(func=lambda call: call.data.startswith(city_markup.prefix))
def callback_inline_cities(call: CallbackQuery):
    name, action, city_from, city_to = call.data.split(city_markup.sep)
    user_id = call.from_user.id

    if action == 'SET':
        bot.edit_message_reply_markup(call.message.chat.id, call.message.id,
                                      reply_markup=city_markup.create_table(city_from=city_from, city_to=city_to))

    elif action == 'SUBMIT':
        bot.delete_messages_safe(call.message.chat.id, [call.message.id])

        if call.message.text.split('\n')[0] == TRACK_INPUT_ROUTE_MSG:
            track_date = bot.db.get_last_track_date(user_id)['date']
            bot.db.update_track_date(user_id, -1, 'from', city_from)
            bot.db.update_track_date(user_id, -1, 'to', city_to)
            d, m, y = [int(i) for i in track_date.split('-')]
            msg = bot.send_message(user_id, choice(LOADING_MSGS),
                                   reply_markup=ReplyKeyboardRemove(), disable_notification=True)
            bot.send_message(user_id, f'<b>{TRACK_INPUT_DEPARTURE_TIME_MSG}</b>' +
                             SELECTED_DATE_MSG % date(d, m, y).strftime('%d %B %Yг. (%a)') +
                             SELECTED_ROUTE_MSG % (city_from, city_to),
                             parse_mode='HTML', disable_notification=True,
                             reply_markup=departure_time_markup.create_list(city_from, city_to, track_date))
            bot.delete_message(user_id, msg.id)

        elif call.message.text.split('\n')[0] == PARSE_INPUT_ROUTE_MSG:
            msg = bot.send_message(user_id, choice(LOADING_MSGS))
            departure_date = bot.db.get_last_parse_data(user_id)['date']
            response = bot.parser.parse(city_from, city_to, departure_date)
            bot.db.update_last_parse_data(user_id, 'from', city_from)
            bot.db.update_last_parse_data(user_id, 'to', city_to)
            logger.info(f"{call.from_user.full_name} @{call.from_user.username} parsed: {departure_date} {city_from} - {city_to}")
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
                    reply_markup=buy_ticket_markup.create(bot.parser.prepare_url(city_from, city_to, departure_date)))
            else:
                bot.edit_message_text(choice(NO_BUSES_MSGS), call.message.chat.id, msg.id)


# DEPARTURE TIME MARKUP
@bot.callback_query_handler(func=lambda call: call.data.startswith(departure_time_markup.prefix))
def callback_inline_departure_time(call: CallbackQuery):
    user_id = call.from_user.id
    name, departure_time, free_places = call.data.split(departure_time_markup.sep)

    track_data = bot.db.get_last_track_date(user_id)
    bot.delete_message(chat_id=call.message.chat.id, message_id=call.message.id)
    departure_date, city_from, city_to = track_data['date'], track_data['from'], track_data['to']
    if 'Нет мест' in free_places:
        is_unique = bot.db.update_track_date(user_id, -1, 'time', departure_time)
        if is_unique:
            response_msg = choice(NOTIFY_TRACK_SET_MSGS)
            track_data['time'] = departure_time
            logger.info(f"{call.from_user.full_name} @{call.from_user.username} set new track data: {track_data}")
        else:
            response_msg = choice(TRACK_RECORD_EXIST_MSGS)
        bot.send_message(user_id, response_msg,
                         reply_markup=ReplyKeyboardRemove(), disable_notification=True)
        message = call.message
        message.from_user = call.from_user
        track(message)
    else:
        bot.send_message(user_id, choice(TRACK_FREE_PLACES_EXISTS_MSGS),
                         disable_notification=True,
                         reply_markup=buy_ticket_markup.create(bot.parser.prepare_url(city_from, city_to, departure_date)))
        bot.db.remove_track_date_by_index(call.from_user.id, -1)


@bot.message_handler(commands=["settings"], func=is_allowed_user)
def settings(message: Message):
    bot.send_message(message.chat.id, FEATURE_NOT_ADDED_MSGS, disable_notification=True)


@bot.message_handler(commands=["extra"])
def extra(message: Message):
    bot.send_message(message.chat.id,
                     EXTRA_MSG + EXTRA_ADMIN_MSG if message.chat.id == int(ADMIN_CHAT_ID) else EXTRA_MSG,
                     parse_mode='HTML', disable_notification=True)


@bot.message_handler(commands=["description"])
def description(message: Message):
    bot.send_message(message.chat.id, DESCRIPTION_MSG, parse_mode='Markdown')
    if not is_allowed_user(message, is_silent=True):
        return
    users = bot.db.get_all_users()
    user_num = len(users)
    notify_num = 0
    track_num = 0
    for user in users:
        notify_num += len(user[3])
        for track_dict in user[4]:
            if track_dict['is_active'] == '1':
                track_num += 1
    bot.send_message(message.chat.id, statistics_msg(user_num, notify_num, track_num, randint(1, 4)),
                     parse_mode='Markdown', disable_notification=True)


@bot.message_handler(commands=["faq"], func=is_allowed_user)
def faq(message: Message):
    bot.send_message(message.chat.id, FAQ_MSG, parse_mode='Markdown')


@bot.message_handler(commands=["feedback"])
def feedback(message: Message):

    def feedback_speech(msg: Message):
        bot.reply_to(msg, FEEDBACK_CONFIRMATION_MSG, disable_notification=True)
        send_markup = ReplyKeyboardMarkup()
        send_markup.row(KeyboardButton('📩 Да, отправить!'), KeyboardButton('🫣 Ой, я передумал'))
        bot.send_message(msg.chat.id, FEEDBACK_TO_ADMIN_MSG % (msg.from_user.full_name, msg.text),
                         reply_markup=send_markup, disable_notification=True)
        bot.register_next_step_handler(msg, feedback_confirmation, msg.text)

    def feedback_confirmation(msg: Message, feedback_text: str):
        if "отправить" in msg.text.lower():
            bot.send_message(ADMIN_CHAT_ID, '#INFO:' + FEEDBACK_TO_ADMIN_MSG % (msg.from_user.full_name, feedback_text))
            bot.send_message(msg.chat.id, FEEDBACK_SUBMIT_MSG,
                             reply_markup=ReplyKeyboardRemove(), disable_notification=True)
            logger.info(f'{msg.from_user.full_name} @{msg.from_user.username} id:{msg.from_user.id} sent feedback: {feedback_text}')
        else:
            bot.send_message(msg.chat.id, choice(CANCEL_MSGS),
                             reply_markup=ReplyKeyboardRemove(), disable_notification=True)

    bot.reply_to(message, FEEDBACK_MSG)
    bot.register_next_step_handler(message, feedback_speech)


@bot.message_handler(commands=["announcement_text"], func=is_admin)
def announcement_text(message: Message):

    def announcement_text_speech(msg: Message):
        bot.reply_to(msg, ANNOUNCEMENT_TEXT_CONFIRMATION_MSG)
        bot.send_message(msg.chat.id, ANNOUNCEMENT_TEXT_MSG % msg.text, parse_mode='Markdown', disable_notification=True)
        bot.register_next_step_handler(msg, announcement_text_confirmation, msg.text)

    def announcement_text_confirmation(msg: Message, ann_text: str):
        if msg.text.title().strip() == "Отправить":
            bot.send_message(msg.chat.id, ANNOUNCEMENT_TEXT_SENT_MSG)
            users = bot.db.get_all_users()
            for user in users:
                bot.send_message(user[2], ANNOUNCEMENT_TEXT_MSG % ann_text, parse_mode='Markdown')
        else:
            bot.send_message(msg.chat.id, choice(CANCEL_MSGS), disable_notification=True)

    bot.send_message(message.chat.id, ANNOUNCEMENT_TEXT_INPUT_MSG)
    bot.register_next_step_handler(message, announcement_text_speech)


@bot.message_handler(commands=["announcement_auto"], func=is_admin)
def announcement_auto(message: Message):
    bot.send_message(message.chat.id, FEATURE_NOT_ADDED_MSGS)


@bot.message_handler(commands=["users"], func=is_admin)
def users_list(message: Message):
    users = bot.db.get_all_users()
    response = ''
    for user in users:
        if not bot.db.is_user_active(user[0]):
            response += '❌ '
        response += '{} - @{}\n'.format(user[0], user[1])
    bot.send_message(message.chat.id, USER_LIST_MSG + response, parse_mode='HTML')


@bot.message_handler(commands=["ban"], func=is_admin)
def ban_user(message: Message):

    def ban_user_confirmation(msg):
        if 'Отменить' in msg.text:
            bot.send_message(msg.chat.id, choice(CANCEL_MSGS), disable_notification=True)
            return

        try:
            blocking_id = int(msg.text)
        except ValueError:
            return
        users = bot.db.get_all_users()
        for user in users:
            if user[0] == blocking_id:
                bot.db.make_user_inactive(blocking_id)
                username = '@{}'.format(user[1]) if user[1] else ' '
                bot.send_message(msg.chat.id, BAN_USER_CONFIRMATION_MSG % username)
                break

    bot.send_message(message.chat.id, BAN_USER_MSG, parse_mode='MarkdownV2')
    users_list(message)
    bot.register_next_step_handler(message, ban_user_confirmation)


@bot.message_handler(commands=["database"], func=is_admin)
def database_view(message: Message):
    users = bot.db.get_all_users()
    response = ''
    for user in users:
        notify_response = ''
        track_response = ''
        for notify_dict in user[3]:
            notify_date = date(*[int(digit) for digit in notify_dict['date'].split('-')])
            notify_response += NOTIFY_TEMPLATE_MSG % notify_date.strftime('%d %B %Yг. (%a)') + '\n'
        for track_dict in user[4]:
            track_date = date(*[int(digit) for digit in track_dict['date'].split('-')])
            track_response += '🟢 ' if track_dict['is_active'] == '1' else '❌ '
            track_response += '%s %s\n%s 👉🏼 %s\n' % (track_date.strftime('%d %B (%a)'), track_dict['time'],
                                                         track_dict['from'], track_dict['to'])
        if notify_response or track_response:
            response += f'@{user[1]}\n'
            response += '1️⃣ \n' + notify_response if notify_response else ''
            response += '2️⃣ \n' + track_response if track_response else ''
    bot.send_message(message.chat.id, DATABASE_LIST_MSG + response, parse_mode='HTML', disable_notification=True)


@bot.message_handler(commands=["exit"], func=is_admin)
def exit_bot(message: Message):

    def exit_bot_confirmation(msg: Message):
        if msg.text.title().strip() == 'Выключение':
            bot.send_message(msg.chat.id, EXIT_MSG)
            logger.critical(f'The bot was disabled at the initiative of the administrator {msg.from_user.full_name} @{msg.from_user.username}')
            bot.stop_bot()
        else:
            bot.send_message(msg.chat.id, choice(CANCEL_MSGS), disable_notification=True)

    bot.send_message(message.chat.id, EXIT_CONFIRMATION_MSG, parse_mode='Markdown')
    bot.register_next_step_handler(message, exit_bot_confirmation)


@bot.message_handler(commands=["register"])
def register(message: Message):

    def register_confirmation(msg: Message):
        code = msg.text.strip(' ')
        codes = bot.db.get_invite_codes()
        if (code,) not in codes:
            bot.send_message(msg.chat.id, REGISTER_CODE_INCORRECT_MSG)
            return
        else:
            bot.db.remove_invite_code(code)
            logger.info(f"{msg.from_user.full_name} @{msg.from_user.username} id:{msg.from_user.id} used an invitation code: {code}")
            bot.send_message(ADMIN_CHAT_ID, f'#INFO {msg.from_user.full_name} @{msg.from_user.username} '
                                            f'использовал пригласительный код')
            bot.send_message(msg.chat.id, REGISTER_CODE_CORRECT_MSG, disable_notification=True)
            start(msg)
            bot.db.make_user_active(msg.from_user.id)

    user_id = message.from_user.id
    if bot.db.get_user(user_id) and bot.db.is_user_active(user_id):
        bot.send_message(message.chat.id, REGISTER_EXISTS_MSG, disable_notification=True)
        return
    bot.send_message(message.chat.id, REGISTER_MSG)
    bot.register_next_step_handler(message, register_confirmation)


@bot.message_handler(commands=["invite_codes"], func=is_admin)
def send_invite_codes(message: Message):
    codes = bot.db.get_invite_codes()
    response = INVITE_CODES_LIST_MSG
    response += "\n".join(f"`{code[0]}`" for code in codes)
    bot.send_message(message.chat.id, response, parse_mode='MarkdownV2', disable_notification=True)


@bot.message_handler(commands=["invite_codes_create"], func=is_admin)
def create_invite_codes(message: Message):
    symbols = ascii_letters + digits
    for _ in range(5):
        bot.db.add_invite_code(''.join(sample(symbols, k=20)))
    bot.send_message(message.chat.id, INVITE_CODES_CREATED_MSG, disable_notification=True)
    send_invite_codes(message)


@bot.message_handler(commands=["logs"], func=is_admin)
def send_logs(message: Message):
    with open('logs.log', 'rb') as f:
        try:
            bot.send_document(message.chat.id, document=f, caption="#LOGS", disable_notification=True)
        except telebot.apihelper.ApiTelegramException:
            bot.send_message(message.chat.id, 'Файл логов пуст', disable_notification=True)


@bot.message_handler(commands=["clear_logs"], func=is_admin)
def clear_logs(message: Message):
    send_logs(message)
    with open('logs.log', 'w') as f:
        f.write('')


@bot.message_handler(commands=["secret"])
def secret(message: Message):
    bot.send_message(message.chat.id, SECRET_MSG, parse_mode='MarkdownV2')
    bot.send_message(ADMIN_CHAT_ID, f'#INFO: {message.from_user.full_name} @{message.from_user.username} отправил /secret')


@bot.message_handler()
def ordinary_text(message: Message):
    if is_allowed_user(message, is_silent=True):
        bot.send_message(message.chat.id, choice(ORDINARY_TEXT_MSGS), disable_notification=True)


while True:
    try:
        bot.setup()
        bot.polling()
    except RuntimeError:
        exit()
    except Exception as err:
        bot.telegram_client.post(method="sendMessage",
                                 params={"text": f"#ERROR: {date.today()} ::: {err.__class__} ::: {err}",
                                         "chat_id": ADMIN_CHAT_ID})
        logger.error(f"{err.__class__} - {err}")
        bot.shutdown()
