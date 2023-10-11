from actions.base import *


class TrackMarkups(BaseMarkup):
    def __init__(self):
        super().__init__()
        self.prefix = 'TRACK'


class Track(BaseAction):
    def __init__(self, bot):
        super().__init__(bot)
        self.markups = TrackMarkups()
        self.max_tracks = 3
