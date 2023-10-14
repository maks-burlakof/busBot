from random import randint, sample
from string import ascii_letters, digits
from telebot.apihelper import ApiTelegramException

from bot.actions.base import *


class Generic(BaseAction):
    def __init__(self, bot: MyBot):
        super().__init__(bot)

    def start(self, message: Message):
        user_id = message.from_user.id
        username = message.from_user.username
        chat_id = message.chat.id
        user = self.bot.db.user_get(user_id)
        if not user:
            self.bot.db.user_add_active(user_id=user_id, username=username, chat_id=chat_id)
            self.bot.send_sticker(chat_id, self.bot.m('start_new_user_sticker'))
            self.bot.send_message_quiet(
                chat_id,
                self.bot.m('start_new_user') % message.from_user.first_name,
                parse_mode='Markdown'
            )
            self.bot.log.info(f'User is registered. {message.from_user.full_name} @{username} id:{user_id}')
        else:
            self.bot.send_sticker(chat_id, self.bot.m('start_old_user_sticker'))
        self.bot.send_message_quiet(chat_id, self.bot.m('start_features'), parse_mode='Markdown')

    def register(self, message: Message):
        def register_handle_confirmation(msg: Message):
            code = msg.text.strip(' ')
            codes = self.bot.db.invite_codes_get()
            if code not in codes:
                self.bot.send_message(msg.chat.id, self.bot.m('register_incorrect'))
                return
            else:
                self.bot.db.invite_code_remove(code)
                self.bot.log.info(f'Invite code used by {msg.from_user.full_name} @{msg.from_user.username} id:{msg.from_user.id}; {code}')
                self.bot.send_message(
                    self.bot.admin_chat_id,
                    f'#info {msg.from_user.full_name} @{msg.from_user.username} использовал пригласительный код'
                )
                self.bot.send_message_quiet(msg.chat.id, self.bot.m('register_correct'))
                self.start(msg)
                self.bot.db.user_make_active(msg.from_user.id)

        user_id = message.from_user.id
        if self.bot.db.user_get(user_id) and self.bot.db.user_is_active(user_id):
            self.bot.send_message_quiet(message.chat.id, self.bot.m('register_exists'))
            return
        self.bot.send_message(message.chat.id, self.bot.m('register_request'))
        self.bot.register_next_step_handler(message, register_handle_confirmation)

    def settings(self, message: Message):
        # Set commands for administrator
        self.bot.set_my_commands(
            self.bot.get_my_commands() + [
                BotCommand('database', 'База данных')
            ],
            BotCommandScopeChat(chat_id=self.bot.admin_chat_id),
        )
        self.bot.send_message_quiet(message.chat.id, self.bot.m('updated'))

    def extra(self, message: Message):
        self.bot.send_message_quiet(
            message.chat.id,
            self.bot.m('extra') + self.bot.m('extra_admin') if message.chat.id == self.bot.admin_chat_id else self.bot.m('extra'),
            parse_mode='HTML'
        )

    def description(self, message: Message):
        self.bot.send_message(message.chat.id, self.bot.m('description'), parse_mode='Markdown')
        if not self.is_allowed_user(message, is_silent=True):
            return
        users = self.bot.db.users_get_all()
        user_num = len(users)
        notify_num = 0
        track_num = 0
        for user in users:
            notify_num += len(user['notify'])
            for track_dict in user['track']:
                if track_dict['is_active']:  # TODO: Проверить везде в reminder is_active = int 1
                    track_num += 1
        self.bot.send_message_quiet(
            message.chat.id,
            self.bot.m('statistics')(user_num, notify_num, track_num, randint(1, 10)),
            parse_mode='Markdown'
        )

    def faq(self, message: Message):
        self.bot.send_message(message.chat.id, self.bot.m('faq'), parse_mode='Markdown')

    def feedback(self, message: Message):
        def feedback_handle_speech(msg: Message):
            if msg.text == '/cancel':
                self.bot.send_message_quiet(msg.chat.id, self.bot.m('cancel'))
                return
            self.bot.reply_to(msg, self.bot.m('feedback_confirm'), disable_notification=True)
            send_markup = ReplyKeyboardMarkup(resize_keyboard=False, one_time_keyboard=True)
            send_markup.row(KeyboardButton('📩 Да, отправить!'), KeyboardButton('🫣 Ой, я передумал'))
            self.bot.send_message_quiet(
                msg.chat.id,
                self.bot.m('feedback_admin') % (msg.from_user.full_name, msg.text),
                reply_markup=send_markup,
            )
            self.bot.register_next_step_handler(msg, feedback_handle_confirmation, msg.text)

        def feedback_handle_confirmation(msg: Message, feedback_text: str):
            if 'отправить' in msg.text.lower():
                self.bot.send_message(
                    self.bot.admin_chat_id,
                    '#info:' + self.bot.m('feedback_admin') % (msg.from_user.full_name, feedback_text)
                )
                self.bot.send_message_quiet(
                    msg.chat.id,
                    self.bot.m('feedback_sent'),
                    reply_markup=ReplyKeyboardRemove(),
                )
                self.bot.log.info(f'Feedback from user: {msg.from_user.full_name} @{msg.from_user.username} id:{msg.from_user.id}. {feedback_text}')
            else:
                self.bot.send_message_quiet(msg.chat.id, self.bot.m('cancel'), reply_markup=ReplyKeyboardRemove())

        self.bot.reply_to(message, self.bot.m('feedback_request'))
        self.bot.register_next_step_handler(message, feedback_handle_speech)

    def announcement_text(self, message: Message):
        def announcement_handle_speech(msg: Message):
            if msg.text == '/cancel':
                self.bot.send_message_quiet(msg.chat.id, self.bot.m('cancel'))
                return
            self.bot.reply_to(msg, self.bot.m('announcement_confirm'), parse_mode='MarkdownV2')
            self.bot.send_message_quiet(
                msg.chat.id,
                self.bot.m('announcement_users') % msg.text,
                parse_mode='Markdown',
            )
            self.bot.register_next_step_handler(msg, announcement_handle_confirmation, msg.text)

        def announcement_handle_confirmation(msg: Message, ann_text: str):
            if msg.text.lower().strip() == 'отправить':
                self.bot.send_message(msg.chat.id, self.bot.m('announcement_sent'))
                users = self.bot.db.users_get_all()
                for user in users:
                    self.bot.send_message(
                        user['chat_id'],
                        self.bot.m('announcement_users') % ann_text,
                        parse_mode='Markdown'
                    )
            else:
                self.bot.send_message_quiet(msg.chat.id, self.bot.m('cancel'))

        self.bot.send_message(message.chat.id, self.bot.m('announcement_request'))
        self.bot.register_next_step_handler(message, announcement_handle_speech)

    def users_list(self, message: Message):
        users = self.bot.db.users_get_all()
        response = ''
        for user in users:
            if not user['is_active']:
                response += '❌ '
            response += f"{user['user_id']} - @{user['username']}\n"
        self.bot.send_message(
            message.chat.id,
            self.bot.m('users_list') + response,
            parse_mode='HTML'
        )

    def ban_user(self, message: Message):
        def ban_user_handle_id(msg):
            if msg.text == '/cancel':
                self.bot.send_message_quiet(msg.chat.id, self.bot.m('cancel'))
                return
            try:
                blocking_id = int(msg.text.strip())
            except ValueError:
                return
            users = self.bot.db.users_get_all()
            for user in users:
                if user['user_id'] == blocking_id:
                    self.bot.db.user_make_inactive(blocking_id)
                    username = f"@{user['username']}" if user['username'] else ' '
                    self.bot.send_message(msg.chat.id, self.bot.m('ban_user_banned') % username)
                    break

        self.bot.send_message(message.chat.id, self.bot.m('ban_user_request'), parse_mode='Markdown')
        self.users_list(message)
        self.bot.register_next_step_handler(message, ban_user_handle_id)

    def database_view(self, message: Message):
        users = self.bot.db.users_get_all()
        response = ''
        for user in users:
            notify_response = ''
            track_response = ''
            for notify_dict in user['notify']:
                notify_date = date(*[int(digit) for digit in notify_dict['date'].split('-')])
                notify_response += self.bot.m('notify_template') % notify_date.strftime('%-d %B %Yг. (%a)') + '\n'
            for track_dict in user['track']:
                track_date = date(*[int(digit) for digit in track_dict['date'].split('-')])
                track_response += '🟢 ' if track_dict['is_active'] else '❌ '
                track_response += '%s %s\n%s 👉🏼 %s\n' % (track_date.strftime('%-d %B (%a)'), track_dict['time'],
                                                         track_dict['from'], track_dict['to'])
            if notify_response or track_response:
                response += f"@{user['username']}\n"
                response += '1️⃣ \n' + notify_response if notify_response else ''
                response += '2️⃣ \n' + track_response if track_response else ''
        self.bot.send_message_quiet(
            message.chat.id,
            self.bot.m('database_view') + response,
            parse_mode='HTML'
        )

    def invite_codes_view(self, message: Message):
        codes = self.bot.db.invite_codes_get()
        response = self.bot.m('invite_codes_list')
        response += '\n'.join(f'`{code}`' for code in codes)
        self.bot.send_message_quiet(message.chat.id, response, parse_mode='MarkdownV2')

    def invite_codes_create(self, message: Message):
        symbols = ascii_letters + digits
        for _ in range(5):
            self.bot.db.invite_code_add(''.join(sample(symbols, k=20)))
        self.bot.send_message_quiet(message.chat.id, self.bot.m('invite_codes_created'))
        self.invite_codes_view(message)

    def logs_send(self, message: Message):
        with open('logs.log', 'rb') as f:
            try:
                self.bot.send_document(
                    message.chat.id,
                    document=f,
                    visible_file_name=f'{datetime.now().strftime("%-d %b %Y, %X")} logs.log',
                    caption='#LOGS',
                    disable_notification=True
                )
            except ApiTelegramException:
                self.bot.send_message_quiet(message.chat.id, 'Файл логов пуст')

    def logs_clear(self, message: Message):
        self.logs_send(message)
        with open('logs.log', 'w') as f:
            f.write('')

    def secret(self, message: Message):
        self.bot.send_message(
            message.chat.id,
            '||по пиву сегодня?||',
            parse_mode='MarkdownV2'
        )
        self.bot.send_message(
            self.bot.admin_chat_id,
            f'#info: {message.from_user.full_name} @{message.from_user.username} отправил /secret'
        )

    def exit_bot(self, message: Message):
        def exit_bot_handle_confirmation(msg: Message):
            if msg.text.lower().strip() == 'выключение':
                self.bot.send_message(msg.chat.id, self.bot.m('exit_exit'))
                self.bot.log.critical(f'The bot was disabled by {msg.from_user.full_name} @{msg.from_user.username}')
                raise RuntimeError(f'The bot was disabled by administrator')
            else:
                self.bot.send_message_quiet(msg.chat.id, self.bot.m('cancel'))

        self.bot.send_message(message.chat.id, self.bot.m('exit_confirm'), parse_mode='Markdown')
        self.bot.register_next_step_handler(message, exit_bot_handle_confirmation)

    def ordinary_text(self, message: Message):
        if self.is_allowed_user(message, is_silent=True):
            self.bot.send_message_quiet(message.chat.id, self.bot.m('no_command'))
