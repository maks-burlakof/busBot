from bot.actions.base import *


class ParseMarkups(BaseMarkup):
    def __init__(self):
        super().__init__()
        self.prefix = 'PARSE'
        self.prefix_calendar = 'PARSECAL'
        self.prefix_cities = 'PARSECITY'
        self.prefix_time = 'PARSETIME'
        self.db_scheme = {
            'date': '',
            'from': '',
            'to': '',
            'time': '',
            'passed': '',
            'is_active': '',
        }

    def calendar_recent_create(self, parse_data: list):
        markup = self.calendar_create()
        for dict_elem in parse_data:
            parse_date = date(*[int(j) for j in dict_elem['date'].split('-')])
            markup.add(InlineKeyboardButton(
                '{} {} → {}'.format(
                    parse_date.strftime('(%a) %-d %b'), dict_elem['from'], dict_elem['to']
                ),
                callback_data=self._cities_submit_callback_data(dict_elem['date'], dict_elem['from'], dict_elem['to'])
            ))
        return markup


class Parse(BaseAction):
    def __init__(self, bot):
        super().__init__(bot)
        self.markups = ParseMarkups()
        self.max_history = 3
        self.temp_template = {
            'action': 'parse',
            'date': None,
        }
        self.db_scheme = {
            'date': '',
            'from': '',
            'to': '',
        }

    def start(self, message: Message):
        self._add(message)

    def _add(self, message: Message):
        user_id = message.from_user.id
        parse_data = self.bot.db.user_get(user_id)['parse']

        # Remove old data from DB
        for dict_ in parse_data:
            date_ = self._get_date_obj(dict_['date'])
            if (date_ - date.today()).days < 0:
                parse_data.remove(dict_)
        over = len(parse_data) - self.max_history
        if over > 0:
            for i in range(over):
                parse_data.pop(i)
        self.bot.db.action_update(user_id, 'parse_data', parse_data)

        self.bot.send_message(
            message.chat.id,
            self.bot.m('request_date'),
            reply_markup=self.markups.calendar_recent_create(parse_data),
        )

    def callback(self, call: CallbackQuery):
        self._callback(call)

    def _date_select(self, call: CallbackQuery, user_id: int, chat_id: int, date_: date):
        super()._date_select(call, user_id, chat_id, date_)

    def _cities_select(self, call: CallbackQuery, user_id: int, chat_id: int, date_: str, from_: str, to_: str):
        msg = self.bot.send_message_quiet(chat_id, self.bot.m('loading'))
        date_ = self._get_date_obj(date_)
        parse_data = self.bot.db.user_get(user_id)['parse']
        parser_data = self.bot.parser.parse(from_, to_, str(date_))
        if parser_data:
            stylized = ""
            for bus in parser_data:
                free_places_info = parser_data[bus]['free_places_info']
                stylized += f"🕓 *{parser_data[bus]['departure_time']}* 👉🏻 {parser_data[bus]['arrival_time']} \n" + \
                            ("⛔️ " if 'Нет мест' in free_places_info else "✅ ") + f"{free_places_info} \n" + \
                            (f"💵 {parser_data[bus]['cost']} \n\n" if 'Нет мест' not in free_places_info else '\n')
            self.bot.edit_message_text(
                self.bot.m('parse_response_template') % (
                    from_, to_, date_.strftime('%-d %B %Yг. (%a)')
                ) + '\n' + stylized,
                chat_id,
                msg.id,
                parse_mode='Markdown',
                reply_markup=self.markups.buy_ticket(
                    self.bot.parser.prepare_url(from_, to_, str(date_))
                )
            )
            json_data = self.db_scheme
            json_data.update({
                'date': str(date_),
                'from': from_,
                'to': to_,
            })
            if json_data not in parse_data:
                self.bot.db.action_update(user_id, 'parse_data', parse_data + [json_data])
        else:
            self.bot.send_message_quiet(chat_id, self.bot.m('no_buses'))
        self.bot.log.info(f"Parsed {date_.strftime('%-d %B %Y (%a)')} {from_} - {to_}. "
                          f"By {call.from_user.full_name} @{call.from_user.username}")
