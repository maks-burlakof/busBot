import locale
from os import environ
from dotenv import load_dotenv
from logging import getLogger, config

from clients import TelegramClient, DatabaseClient, SiteParser
from botclass import MyBot
from bot import initialize
from database import DatabaseActions
from message_texts import MESSAGES

# Configure environment
load_dotenv()
locale.setlocale(locale.LC_ALL, ('ru_RU', 'UTF-8'))

# Env variables
TOKEN = environ.get('TOKEN')
ADMIN_CHAT_ID = environ.get('ADMIN_CHAT_ID')

# Clients
telegram_client = TelegramClient(token=TOKEN)
database_client = DatabaseClient(filepath='users.db')
parser_client = SiteParser()

# Logging
config.fileConfig(fname='configs/logging_config.conf', disable_existing_loggers=False)
logger = getLogger(__name__)

# Bot
database_actions = DatabaseActions(database_client=database_client)
bot = MyBot(token=TOKEN, telegram_client=telegram_client, database_actions=database_actions, logger=logger, admin_chat_id=ADMIN_CHAT_ID, messages=MESSAGES)
initialize(bot)

if __name__ == '__main__':
    while True:
        try:
            bot.setup()
            bot.polling()
        except (RuntimeError, KeyboardInterrupt):
            break
        except Exception as err:
            bot.tg.post(
                method="sendMessage",
                params={'text': f'#Error {err.__class__}\n{err}', 'chat_id': bot.admin_chat_id})
            bot.log.error(f"{err.__class__} - {err}")
            bot.shutdown()
