from actions.base import *


class NotifyMarkups(BaseMarkup):
    def __init__(self):
        super().__init__()
        self.prefix = 'NOTIFY'

    def add(self, total_num: int) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(InlineKeyboardButton('✅ Добавить', callback_data=self.sep.join([self.prefix, 'ADD', '-1', str(total_num)])))
        return keyboard

    def remove(self, index: int, total_num: int) -> InlineKeyboardMarkup:
        keyboard = InlineKeyboardMarkup()
        keyboard.add(InlineKeyboardButton('❌ Отменить', callback_data=self.sep.join([self.prefix, 'REMOVE', str(index), str(total_num)])))
        return keyboard


class Notify(BaseAction):
    def __init__(self, bot):
        super().__init__(bot)
        self.markups = NotifyMarkups()
        self.max_dates = 3

    def start(self, message: Message):
        user_id = message.from_user.id
        chat_id = message.chat.id
        notify_data = self.bot.db.user_get(user_id)['notify']

        if notify_data:
            len_data = len(notify_data)
            markup = self.markups.add(len_data) if len_data < self.max_dates else None
            self.bot.send_message(
                chat_id,
                self.bot.m('notify_start_header'),
                reply_markup=markup,
                parse_mode='Markdown'
            )
            for i in range(len_data):
                notify_date = self._get_date_obj(notify_data[i]['date'])
                self.bot.send_message_quiet(
                    chat_id,
                    self.bot.m('notify_template') % notify_date.strftime('%d %B %Yг. (%a)'),
                    reply_markup=self.markups.remove(i, len_data)
                )
        else:
            self.bot.temp[user_id] = {
                'action': 'notify',
                'date': None,
            }
            self.bot.send_message(
                chat_id,
                self.bot.m('notify_request_date'),
                reply_markup=self.markups.calendar()
            )

    def callback(self, call: CallbackQuery):
        callback_data = call.data.split(self.markups.sep)
        action = callback_data[1]
        index = int(callback_data[2])
        total_num = int(callback_data[3])

        if action == 'ADD':
            self._add(call)

        elif action == 'REMOVE':
            self._delete(call, index)

            msg = call.message
            msg.from_user = call.from_user
            self.start(msg)

        ids_list = [
            *range(call.message.id - index - 1, call.message.id),
            *range(call.message.id, call.message.id + total_num - index)
        ]
        self.bot.delete_messages_safe(call.message.chat.id, ids_list)

    def _add(self, call: CallbackQuery):
        user_id = call.from_user.id
        chat_id = call.message.chat.id
        notify_data = self.bot.db.user_get(user_id)['notify']

        if len(notify_data) < self.max_dates:
            self.bot.temp[user_id] = {
                'action': 'notify',
                'date': None,
            }
            self.bot.send_message_quiet(
                chat_id,
                self.bot.m('notify_request_date'),
                reply_markup=self.markups.calendar()
            )
        else:
            self.bot.send_message_quiet(chat_id, self.bot.m('notify_exceeded')(self.max_dates))

    def _delete(self, call: CallbackQuery, index: int):
        user_id = call.from_user.id
        chat_id = call.message.chat.id

        self.bot.db.notify_delete(user_id, index)
        self.bot.send_message_quiet(chat_id, self.bot.m('notify_delete_success'))












