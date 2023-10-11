from actions.base import *


class ParseMarkups(BaseMarkup):
    def __init__(self):
        super().__init__()
        self.prefix = 'PARSE'


class Parse(BaseAction):
    def __init__(self, bot):
        super().__init__(bot)
        self.markups = ParseMarkups()
