from clients.sqlite3_client import SQLiteClient
from clients.telegram_client import TelegramClient
from actioners import UserActioner
from workers.reminder import Reminder, TOKEN

database_client = SQLiteClient('FULL PATH TO YOUR DATABASE')
telegram_client = TelegramClient(token=TOKEN, base_url="https://api.telegram.org")
user_actioner = UserActioner(database_client=database_client)
reminder = Reminder(database_client=database_client, telegram_client=telegram_client, user_actioner=user_actioner)
reminder.setup()

reminder.execute_notify()
