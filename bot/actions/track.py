from bot.actions.base import *


class TrackMarkups(BaseMarkup):
    def __init__(self):
        super().__init__()
        self.prefix = 'TRACK'
        self.prefix_calendar = 'TRACKCAL'
        self.prefix_cities = 'TRACKCITY'
        self.prefix_time = 'TRACKTIME'

    def calendar_recent_create(self, track_data: list) -> InlineKeyboardMarkup:
        markup = self.calendar_create()
        for dict_elem in track_data:
            if not dict_elem['is_active']:
                track_date = date(*[int(j) for j in dict_elem['date'].split('-')])
                if (track_date - date.today()).days >= 0:
                    markup.add(InlineKeyboardButton(
                        '{} {} → {}'.format(
                            track_date.strftime('(%a) %-d %b'), dict_elem['from'], dict_elem['to']
                        ),
                        callback_data=self._cities_submit_callback_data(dict_elem['date'], dict_elem['from'], dict_elem['to'])
                    ))
        return markup


class Track(BaseAction):
    def __init__(self, bot):
        super().__init__(bot)
        self.markups = TrackMarkups()
        self.max_tracks = 3
        self.max_history = 3
        self.db_scheme = {
            'date': '',
            'from': '',
            'to': '',
            'time': '',
            'passed': '',
            'is_active': '',
        }

    @staticmethod
    def _find_track_in_data(track_data: list, date_: str, from_: str, to_: str, time_: str, is_active: int):
        for i in range(len(track_data)):
            if (date_, from_, to_, time_, is_active) == (
                    track_data[i]['date'], track_data[i]['from'], track_data[i]['to'],
                    track_data[i]['time'], track_data[i]['is_active']
            ):
                return i
        return None

    @staticmethod
    def _get_active_data(track_data: list):
        return [dict_elem for dict_elem in track_data if dict_elem['is_active']]

    @staticmethod
    def _get_inactive_data(track_data: list):
        return [dict_elem for dict_elem in track_data if not dict_elem['is_active']]

    def _set_new_data(self, user_id: int, track_data: list, date_: str, from_: str, to_: str, time_: str):
        json_data = self.db_scheme
        json_data.update({
            'date': date_,
            'from': from_,
            'to': to_,
            'time': time_,
            'passed': 0,
            'is_active': 1,
        })
        self.bot.db.action_update(user_id, 'track_data', track_data + [json_data])

    def start(self, message: Message):
        user_id = message.from_user.id
        chat_id = message.chat.id
        track_data = self.bot.db.user_get(user_id)['track']
        track_data_active = sorted(self._get_active_data(track_data), key=lambda dct: dct['date'])

        if track_data_active:
            len_data = len(track_data_active)
            self.bot.send_message(
                chat_id,
                self.bot.m('track_start_header'),
                reply_markup=self.markups.add(len_data) if len_data < self.max_tracks else None,
                parse_mode='Markdown'
            )
            for i in range(len_data):
                track_date = self._get_date_obj(track_data_active[i]['date'])
                track_from, track_to, track_time = track_data_active[i]['from'], track_data_active[i]['to'], track_data_active[i]['time']
                same_count = 0  # TODO: bot.db.same_track_data_count()
                self.bot.send_message_quiet(
                    chat_id,
                    self.bot.m('track_template') % (
                        track_date.strftime('%-d %B (%a)'), track_from, track_to, track_time
                    ) + (
                        self.bot.m('track_other_people')(same_count) if same_count > 0 else ''
                    ),
                    reply_markup=self.markups.delete_update(i, len_data, str(track_date), track_from, track_to, track_time)
                )
        else:
            self._add(user_id, chat_id)

    def callback(self, call: CallbackQuery):
        self._callback(call)

    def _add(self, user_id: int, chat_id: int):
        track_data = self.bot.db.user_get(user_id)['track']
        track_data_active = self._get_active_data(track_data)

        if len(track_data_active) < self.max_tracks:

            # Remove old non-unique inactive data
            track_data_inactive = self._get_inactive_data(track_data)
            track_data_inactive_unique = set()
            for dict_ in track_data_inactive:
                # Check date actuality
                date_ = self._get_datetime_obj(dict_['date'])
                if date_ < datetime.today():
                    track_data.remove(dict_)
                    continue
                # Check unique
                dict_str = f"{dict_['date']}{dict_['from']}{dict_['to']}"
                if dict_str not in track_data_inactive_unique:
                    track_data_inactive_unique.add(dict_str)
                else:
                    track_data.remove(dict_)

            # Remove old inactive data by length
            over = len(track_data_inactive) - self.max_history
            if over > 0:
                for i in range(over):
                    track_data.remove(track_data_inactive[i])
            self.bot.db.action_update(user_id, 'track_data', track_data)

            self.bot.send_message_quiet(
                chat_id,
                self.bot.m('request_date'),
                reply_markup=self.markups.calendar_recent_create(track_data),
            )
        else:
            self.bot.send_message_quiet(chat_id, self.bot.m('track_exceeded')(self.max_tracks))

    def _delete(self, call: CallbackQuery, user_id: int, chat_id: int, date_: str, from_: str, to_: str, time_: str):
        track_data = self.bot.db.user_get(user_id)['track']
        index = self._find_track_in_data(track_data, date_, from_, to_, time_, 1)

        if index != None:
            data_to_remove = track_data[index]
            track_data.pop(index)
            self.bot.db.action_update(user_id, 'track_data', track_data)
            deleted_date = self._get_date_obj(data_to_remove['date'])
            self.bot.send_message_quiet(
                user_id,
                self.bot.m('track_delete_success') + '\n' + self.bot.m('track_template') % (
                    deleted_date.strftime('%-d %B (%a)'), data_to_remove['from'],
                    data_to_remove['to'], data_to_remove['time'])
            )
        else:
            self.bot.answer_callback_query(call.id, self.bot.m('no_records'))

        msg = call.message
        msg.from_user = call.from_user
        self.start(msg)

    def _update(self, call: CallbackQuery, date_: str, from_: str, to_: str, time_: str):
        free_seats = self.bot.parser.get_free_seats(from_, to_, date_, time_)
        if free_seats:
            self.bot.answer_callback_query(
                call.id,
                '✅\n\n' + self.bot.m('track_notification') % (
                    self._get_date_obj(date_).strftime('%-d %B %Yг. (%a)'), from_, to_, time_
                ),
                show_alert=True,
            )
        else:
            self.bot.answer_callback_query(call.id, '❌\n\n' + self.bot.m('track_no_seats'), show_alert=True)

    def _date_select(self, call: CallbackQuery, user_id: int, chat_id: int, date_: date):
        super()._date_select(call, user_id, chat_id, date_)

    def _cities_select(self, call: CallbackQuery, user_id: int, chat_id: int, date_: str, from_: str, to_: str):
        msg = self.bot.send_message_quiet(chat_id, self.bot.m('loading'))
        date_ = self._get_date_obj(date_)
        parser_data = self.bot.parser.parse(from_, to_, str(date_))
        if parser_data:
            self.bot.edit_message_text(
                f'<b>{self.bot.m("request_time")}</b>' +
                    self.bot.m('selected_date') % date_.strftime('%-d %B %Yг. (%a)') +
                    self.bot.m('selected_cities') % (from_, to_),
                chat_id,
                msg.id,
                parse_mode='HTML',
                reply_markup=self.markups.departure_time(str(date_), from_, to_, parser_data)
            )
        else:
            self.bot.send_message_quiet(chat_id, self.bot.m('no_buses'))

    def _time_select(self, call: CallbackQuery, user_id: int, chat_id: int,
                     date_: str, from_: str, to_: str, time_: str, free_seats_num: str):
        date_ = self._get_date_obj(date_)
        track_data = self.bot.db.user_get(user_id)['track']

        if free_seats_num == '0':
            if self._find_track_in_data(track_data, str(date_), from_, to_, time_, 1) == None:
                inactive_index = self._find_track_in_data(track_data, str(date_), from_, to_, time_, 0)
                if inactive_index != None:
                    track_data.pop(inactive_index)
                self._set_new_data(user_id, track_data, str(date_), from_, to_, time_)
                self.bot.answer_callback_query(call.id, self.bot.m('action_set'))
                self.bot.log.info(f"Set new track data: {date_.strftime('%-d %B %Yг. (%a)')} {from_} {to_} {time_}. "
                                  f"By {call.from_user.full_name} @{call.from_user.username}")
            else:
                self.bot.send_message_quiet(chat_id, self.bot.m('track_exist'))

            msg = call.message
            msg.from_user = call.from_user
            self.start(msg)

        else:
            self.bot.send_message_quiet(
                chat_id,
                self.bot.m('track_exist_seats'),
                reply_markup=self.markups.buy_ticket(self.bot.parser.prepare_url(from_, to_, str(date_)))
            )

        self.bot.delete_messages_safe(chat_id, [call.message.id])

    def status(self, message: Message):
        user_id = message.from_user.id
        chat_id = message.chat.id
        from_ = 'Витебск'
        to_ = 'Минск'

        msg = self.bot.send_message_quiet(chat_id, self.bot.m('loading'))
        track_data = self.bot.db.user_get(user_id)['track']

        for date_ in [date.today() + timedelta(days=i) for i in range(5)]:
            response = self.bot.parser.parse(from_, to_, str(date_))
            for data in response.values():
                time_ = data['departure_time']
                if data['free_places_info'] != 'Нет мест':
                    ind1 = self._find_track_in_data(track_data, str(date_), from_, to_, time_, 1)
                    ind2 = self._find_track_in_data(track_data, str(date_), from_, to_, time_, 0)
                    if not ind1 and not ind2:
                        self._set_new_data(user_id, track_data, str(date_), from_, to_, time_)
                        self.bot.edit_message_text(
                            '*Статус подключения*\n✅ route.by\n🌀 Reminder Track\n\n*Установлен тестовый рейс:*' +
                                self.bot.m('selected_date') % date_.strftime('%-d %B %Yг. (%a)') +
                                self.bot.m('selected_cities') % (from_, to_) + f', {time_}',
                            chat_id,
                            msg.id,
                            parse_mode='Markdown',
                        )
                        self.start(message)
                        return
        self.bot.edit_message_text(self.bot.m('no_buses'), chat_id, msg.id)
