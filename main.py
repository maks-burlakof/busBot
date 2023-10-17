import locale
from os import environ
from dotenv import load_dotenv
from logging import getLogger, config
import traceback

from clients import TelegramClient, DatabaseClient, SiteParser
from bot.botclass import MyBot
from bot.bot import initialize
from bot.database import DatabaseActions
from bot.message_texts import MESSAGES

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
bot = MyBot(
    token=TOKEN, telegram_client=telegram_client, parser_client=parser_client, database_actions=database_actions,
    logger=logger, admin_chat_id=ADMIN_CHAT_ID, messages=MESSAGES
)

if __name__ == '__main__':
    bot.setup()
    bot.db.system_update('start_time')
    initialize(bot)

    while True:
        try:
            bot.setup()
            bot.polling()
        except RuntimeError:
            bot.stop_bot()
            bot.shutdown()
            break
        except Exception as err:  # TODO: do not log requests TimedOut errors
            bot.db.system_update('exception_time')
            exc_desc_lines = traceback.format_exception_only(type(err), err)
            exc_desc = ''.join(exc_desc_lines).rstrip()
            bot.tg.post(
                method="sendMessage",
                params={'text': f'#error {exc_desc}', 'chat_id': bot.admin_chat_id})
            bot.log.error(f'{exc_desc}')
            bot.shutdown()
