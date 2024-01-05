from argparse import ArgumentParser, BooleanOptionalAction
from functools import wraps
from time import time
from datetime import date, datetime, timedelta

from main import bot


def _check_working_time(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time()
        func(*args, **kwargs)
        end_time = time()
        print(f'\nTest func: {func.__name__.title()}.\nExecution time: {round(end_time - start_time, 5)} sec.')
    return wrapper


@_check_working_time
def db_time(n: int):
    for _ in range(n):
        a = bot.db.user_get(bot.admin_chat_id)


@_check_working_time
def parser_time(n: int):
    from_ = 'Витебск'
    to_ = 'Минск'
    datetime_ = datetime.today() + timedelta(days=1)
    date_ = date(datetime_.year, datetime_.month, datetime_.day)
    for i in range(n):
        bot.parser.parse(from_, to_, str(date_))


@_check_working_time
def api_parser_time(n: int):
    from_ = 'Витебск'
    to_ = 'Минск'
    datetime_ = datetime.today() + timedelta(days=1)
    date_ = date(datetime_.year, datetime_.month, datetime_.day)
    for i in range(n):
        bot.parser.api_parse(from_, to_, str(date_))


if __name__ == '__main__':
    parser = ArgumentParser(description='Run the test scripts')
    parser.add_argument('-action', '-a', required=True, type=str, choices=('db', 'parser', 'api-parser'), help='Test to be performed')
    parser.add_argument('-n', required=True, type=int, help='Number of requests')
    args = parser.parse_args()

    action = args.action.lower()
    requests_num = args.n

    bot.setup()
    if action == 'db':
        db_time(requests_num)
    elif action == 'parser':
        parser_time(requests_num)
    elif action == 'api-parser':
        api_parser_time(requests_num)
    bot.shutdown()
