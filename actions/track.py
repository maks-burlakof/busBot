from actions.base import *


class TrackMarkups(BaseMarkup):
    def __init__(self):
        super().__init__()
        self.prefix = 'TRACK'
        self.prefix_calendar = 'TRACKCAL'
        self.prefix_cities = 'TRACKCITY'
        self.prefix_time = 'TRACKTIME'


class Track(BaseAction):
    def __init__(self, bot):
        super().__init__(bot)
        self.markups = TrackMarkups()
        self.max_tracks = 3
        self.temp_template = {
            'action': 'track',
            'date': None,
            'from': '',
            'to': '',
            'time': '',
        }
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

    def start(self, message: Message):
        user_id = message.from_user.id
        chat_id = message.chat.id
        track_data = self.bot.db.user_get(user_id)['track']
        track_data_active = [dict_elem for dict_elem in track_data if dict_elem['is_active']]

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
                track_from, track_to, track_time = track_data[i]['from'], track_data[i]['to'], track_data[i]['time']
                same_count = 0  # TODO: bot.db.same_track_data_count()
                self.bot.send_message_quiet(
                    chat_id,
                    self.bot.m('track_template') % (
                        track_date.strftime('%d %B (%a)'), track_from, track_to, track_time
                    ) + (
                        self.bot.m('track_other_people')(same_count) if same_count > 0 else ''
                    ),
                    reply_markup=self.markups.delete_update(i, len_data, str(track_date), track_from, track_to, track_time)
                )
        else:
            self._add(user_id, chat_id)

    def callback(self, call: CallbackQuery):
        self._callback(call)

    def _add(self, user_id: int, chat_id: int):  # TODO: удалить старые записи track с is_active = 0
        track_data = self.bot.db.user_get(user_id)['track']
        track_data_active = [dict_elem for dict_elem in track_data if dict_elem['is_active']]
        if len(track_data_active) < self.max_tracks:
            markup = self.markups.calendar_create()
            for dict_elem in track_data:
                if not dict_elem['is_active']:
                    track_date = self._get_date_obj(dict_elem['date'])
                    if (track_date - date.today()).days >= 0:
                        markup.add(InlineKeyboardButton(
                            '📆 {} {} 👉 {}'.format(
                                track_date.strftime('%d %B (%a)'), dict_elem['from'], dict_elem['to']
                            ),
                            callback_data=None  # TODO: После нажатия на выбор города
                        ))
            self.bot.send_message_quiet(chat_id, self.bot.m('request_date'), reply_markup=markup)
        else:
            self.bot.send_message_quiet(chat_id, self.bot.m('track_exceeded')(self.max_tracks))

    def _delete(self, call: CallbackQuery, user_id: int, chat_id: int, date_, from_, to_, time_):
        track_data = self.bot.db.user_get(user_id)['track']
        index = self._find_track_in_data(track_data, date_, from_, to_, time_, 1)

        if index != None:
            data_to_remove = track_data[index]
            track_data.pop(index)
            self.bot.db.track_update(user_id, track_data)
            deleted_date = self._get_date_obj(data_to_remove['date'])
            self.bot.send_message_quiet(
                user_id,
                self.bot.m('track_delete_success') + '\n' + self.bot.m('track_template') % (
                    deleted_date.strftime('%d %B (%a)'), data_to_remove['from'],
                    data_to_remove['to'], data_to_remove['time'])
            )
        else:
            self.bot.send_message_quiet(chat_id, self.bot.m('no_records'))

        msg = call.message
        msg.from_user = call.from_user
        self.start(msg)

    def _update(self, call: CallbackQuery, date_: str, from_: str, to_: str, time_: str):
        free_seats = self.bot.parser.get_free_seats(from_, to_, date_, time_)
        if free_seats:
            self.bot.answer_callback_query(
                call.id,
                '✅\n\n' + self.bot.m('track_notification') % (
                    self._get_date_obj(date_).strftime('%d %B %Yг. (%a)'), from_, to_, time_
                ),
                show_alert=True,
            )
        else:
            self.bot.answer_callback_query(call.id, '❌\n\n' + self.bot.m('track_no_seats'), show_alert=True)

    def _date_select(self, call: CallbackQuery, user_id: int, chat_id: int, chosen_date: date):
        if (chosen_date - date.today()).days > self.bot.time_delta:
            self.bot.send_message_quiet(chat_id, self.bot.m('no_records'))
            return

        self.bot.temp[user_id] = self.temp_template
        self.bot.temp[user_id]['date'] = chosen_date
        self.bot.send_message_quiet(
            user_id,
            f'<b>{self.bot.m("request_cities")}</b>' + self.bot.m('selected_date') % chosen_date.strftime('%d %B %Yг. (%a)'),
            parse_mode='HTML',
            reply_markup=self.markups.cities()
        )

    def _cities_select(self, user_id: int, chat_id: int, city_from: str, city_to: str):
        chosen_date = self.bot.temp[user_id]['date']
        self.bot.temp[user_id]['from'] = city_from
        self.bot.temp[user_id]['to'] = city_to
        msg = self.bot.send_message_quiet(chat_id, self.bot.m('loading'))
        parser_data = self.bot.parser.parse(city_from, city_to, str(chosen_date))
        if parser_data:
            self.bot.send_message_quiet(
                chat_id,
                f'<b>{self.bot.m("request_time")}</b>' +
                    self.bot.m('selected_date') % chosen_date.strftime('%d %B %Yг. (%a)') +
                    self.bot.m('selected_cities') % (city_from, city_to),
                parse_mode='HTML',
                reply_markup=self.markups.departure_time(parser_data)
            )
        else:
            self.bot.send_message_quiet(chat_id, self.bot.m('no_buses'))
        self.bot.delete_messages_safe(chat_id, [msg.id])

    def _time_select(self, call: CallbackQuery, user_id: int, chat_id: int, departure_time: str, free_places: int):
        chosen_date, city_from, city_to = (self.bot.temp[user_id][key] for key in ['date', 'from', 'to'])
        track_data = self.bot.db.user_get(user_id)['track']

        if 'Нет мест' in free_places:
            if self._find_track_in_data(track_data, str(chosen_date), city_from, city_to, departure_time, 1) == None:
                json_data = self.db_scheme
                json_data.update({
                    'date': str(chosen_date),
                    'from': city_from,
                    'to': city_to,
                    'time': departure_time,
                    'passed': 0,
                    'is_active': 1,
                })
                self.bot.db.track_update(user_id, track_data + [json_data])
                self.bot.answer_callback_query(call.id, self.bot.m('action_set'))
                self.bot.log.info(f'Set new track data: {track_data}. By {call.from_user.full_name} @{call.from_user.username}')
            else:
                self.bot.send_message_quiet(chat_id, self.bot.m('track_exist'))

            msg = call.message
            msg.from_user = call.from_user
            self.start(msg)

        else:
            self.bot.send_message_quiet(
                chat_id,
                self.bot.m('track_exist_seats'),
                reply_markup=self.markups.buy_ticket(self.bot.parser.prepare_url(city_from, city_to, str(chosen_date)))
            )

        self.bot.delete_messages_safe(chat_id, [call.message.id])
