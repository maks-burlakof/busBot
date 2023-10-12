from actions.base import *


class NotifyMarkups(BaseMarkup):
    def __init__(self):
        super().__init__()
        self.prefix = 'NOTI'
        self.prefix_calendar = 'NOTICAL'


class Notify(BaseAction):
    def __init__(self, bot):
        super().__init__(bot)
        self.markups = NotifyMarkups()
        self.max_dates = 3
        self.db_scheme = {
            'date': '',
        }

    def start(self, message: Message):
        user_id = message.from_user.id
        chat_id = message.chat.id
        notify_data = self.bot.db.user_get(user_id)['notify']

        if notify_data:
            len_data = len(notify_data)
            self.bot.send_message(
                chat_id,
                self.bot.m('notify_start_header'),
                reply_markup=self.markups.add(len_data) if len_data < self.max_dates else None,
                parse_mode='Markdown'
            )
            for i in range(len_data):
                notify_date = self._get_date_obj(notify_data[i]['date'])
                self.bot.send_message_quiet(
                    chat_id,
                    self.bot.m('notify_template') % notify_date.strftime('%d %B %Yг. (%a)'),
                    reply_markup=self.markups.delete(i, len_data)
                )
        else:
            self._add(user_id, chat_id)

    def callback(self, call: CallbackQuery):
        self._callback(call)

    def _add(self, user_id: int, chat_id: int):
        notify_data = self.bot.db.user_get(user_id)['notify']
        if len(notify_data) < self.max_dates:
            self.bot.send_message_quiet(chat_id, self.bot.m('request_date'), reply_markup=self.markups.calendar_create())
        else:
            self.bot.send_message_quiet(chat_id, self.bot.m('notify_exceeded')(self.max_dates))

    def _delete(self, call: CallbackQuery, user_id: int, chat_id: int, index: int):
        notify_data = self.bot.db.user_get(user_id)['notify']
        notify_data.pop(index)
        self.bot.db.notify_update(user_id, notify_data)
        self.bot.answer_callback_query(call.id, self.bot.m('notify_delete_success'))

        msg = call.message
        msg.from_user = call.from_user
        self.start(msg)

    def _date_select(self, call: CallbackQuery, user_id: int, chat_id: int, chosen_date: date):
        notify_data = self.bot.db.user_get(user_id)['notify']

        if (chosen_date - date.today()).days <= self.bot.time_delta:
            self.bot.send_message_quiet(chat_id, self.bot.m('notify_exist_date'))
            return
        if str(chosen_date) in [dict_data['date'] for dict_data in notify_data]:
            self.bot.send_message_quiet(chat_id, self.bot.m('notify_exist'))
            return

        json_data = self.db_scheme
        json_data.update({
            'date': str(chosen_date),
        })
        self.bot.db.notify_update(user_id, notify_data + [json_data])

        self.bot.answer_callback_query(call.id, self.bot.m('action_set'))
        self.bot.log.info(f"Set new notify date: {chosen_date}. By {call.from_user.full_name} @{call.from_user.username}")

        msg = call.message
        msg.from_user = call.from_user
        self.start(msg)
