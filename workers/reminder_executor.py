from logging import getLogger, config
import datetime
import time
from envparse import Env
from clients.sqlite3_client import SQLiteClient
from clients.telegram_client import TelegramClient
from actioners import UserActioner
from workers.reminder import Reminder

config.fileConfig(fname='logging_config.conf', disable_existing_loggers=False)
logger = getLogger(__name__)

env = Env()
TOKEN = env.str("TOKEN")
FROM_TIME = env.str("FROM_TIME", default='10:00')
TO_TIME = env.str("TO_TIME", default='23:59')
REMINDER_PERIOD = env.int("REMINDER_PERIOD", default=10)
SLEEP_CHECK_PERIOD = env.int("REMINDER_PERIOD", default=3600)

database_client = SQLiteClient('FULL PATH TO YOUR DATABASE')
telegram_client = TelegramClient(token=TOKEN, base_url="https://api.telegram.org")
user_actioner = UserActioner(database_client=database_client)
reminder = Reminder(database_client=database_client, telegram_client=telegram_client, user_actioner=user_actioner)
reminder.setup()

start_time = datetime.datetime.strptime(FROM_TIME, '%H:%M').time()
end_time = datetime.datetime.strptime(TO_TIME, '%H:%M').time()

while True:
    now_time = datetime.datetime.now().time()
    if start_time <= now_time <= end_time:
        reminder()
        time.sleep(REMINDER_PERIOD)
    else:
        time.sleep(SLEEP_CHECK_PERIOD)
