from bot.actions.base import *


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

    @staticmethod
    def _find_track_in_data(notify_data: list, date_: str):
        for i in range(len(notify_data)):
            if date_ == notify_data[i]['date']:
                return i
        return None

    def start(self, message: Message):
        user_id = message.from_user.id
        chat_id = message.chat.id
        notify_data = sorted(self.bot.db.user_get(user_id)['notify'], key=lambda dct: dct['date'])

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
                    self.bot.m('notify_template') % notify_date.strftime('%-d %B %Yг. (%a)'),
                    reply_markup=self.markups.delete_update(i, len_data, notify_data[i]['date'])
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

    def _delete(self, call: CallbackQuery, user_id: int, chat_id: int, date_, *args):
        notify_data = self.bot.db.user_get(user_id)['notify']
        index = self._find_track_in_data(notify_data, date_)

        if index != None:
            notify_data.pop(index)
            self.bot.db.action_update(user_id, 'notify_data', notify_data)
            self.bot.answer_callback_query(call.id, self.bot.m('notify_delete_success'))
        else:
            self.bot.answer_callback_query(call.id, self.bot.m('no_records'))

        if notify_data:
            msg = call.message
            msg.from_user = call.from_user
            self.start(msg)

    def _update(self, call: CallbackQuery, date_: str, *args):
        parsed_data = self.bot.parser.parse('Шумилино', 'Минск', date_)
        if parsed_data:
            self.bot.answer_callback_query(
                call.id,
                '✅\n\n' + self.bot.m('notify_notification') % self._get_date_obj(date_).strftime('%-d %B %Yг. (%a)'),
                show_alert=True,
            )
        else:
            self.bot.answer_callback_query(call.id, '❌\n\n' + self.bot.m('notify_not_exist_date'), show_alert=True)

    def _date_select(self, call: CallbackQuery, user_id: int, chat_id: int, date_: date):
        notify_data = self.bot.db.user_get(user_id)['notify']

        if (date_ - date.today()).days <= self.bot.time_delta:
            self.bot.send_message_quiet(chat_id, self.bot.m('notify_exist_date'))
            return
        if self._find_track_in_data(notify_data, str(date_)) != None:
            self.bot.send_message_quiet(chat_id, self.bot.m('notify_exist'))
            return

        json_data = self.db_scheme
        json_data.update({
            'date': str(date_),
        })
        self.bot.db.action_update(user_id, 'notify_data', notify_data + [json_data])

        self.bot.answer_callback_query(call.id, self.bot.m('action_set'))
        self.bot.log.info(f"Set new notify date: {date_}. By {call.from_user.full_name} @{call.from_user.username}")

        msg = call.message
        msg.from_user = call.from_user
        self.start(msg)
