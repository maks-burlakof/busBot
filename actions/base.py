from datetime import date

from bot import MyBot
from inline_markups import Calendar, CallbackData


class Action:
    def __init__(self, bot: MyBot, calendar_markup: Calendar, calendar_callback: CallbackData):
        self.bot = bot
        self.calendar = calendar_markup
        self.calendar_callback = calendar_callback

    @staticmethod
    def _get_date_obj(str_date: str) -> date:
        y, m, d = [int(j) for j in str_date.split('-')]
        date_obj = date(y, m, d)
        return date_obj
