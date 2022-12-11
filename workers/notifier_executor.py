from clients.sqlite3_client import SQLiteClient
from clients.telegram_client import TelegramClient
from clients.routeby_client import SiteParser
from actioners import UserActioner
from workers.reminder import Reminder, TOKEN

PATH_TO_DATABASE = '/home/maksim/python/marshrutka/users.db'

database_client = SQLiteClient(PATH_TO_DATABASE)
telegram_client = TelegramClient(token=TOKEN, base_url="https://api.telegram.org")
user_actioner = UserActioner(database_client=database_client)
parser = SiteParser()
reminder = Reminder(database_client=database_client, telegram_client=telegram_client,
                    user_actioner=user_actioner, parser=parser)
reminder.setup()

reminder.execute_notify()
