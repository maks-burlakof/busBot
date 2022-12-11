from subprocess import run


def cprint(text: str):
    print(f'\033[1m\033[33m\033[41m{text}\033[0m')


def setup():
    cprint('Привет. Этот python скрипт поможет тебе настроить работу бота на любом устройстве.')
    cprint('Внимание! Скрипт настройки протестирован только на Ubuntu. Работоспособность на Windows не гарантируется.')
    while True:
        cprint('1. Ты используешь виртуальное окружение?')
        is_venv = input(' [y/n] ').lower()
        if is_venv == 'y':
            cprint('Используется виртуальное окружение.\n'
                   'Зависимости из requirements.txt будут установлены в виртуальном окружении.')
            if input('Продолжить? [y/n] ') != 'y':
                cprint('Действие отменено')
                continue
            break
        elif is_venv == 'n':
            cprint('Виртуальное окружение не используется.\n'
                   'Зависимости из requirements.txt будут установлены глобально.')
            if input('Продолжить? [y/n] ') != 'y':
                cprint('Действие отменено')
                continue
            break

    if is_venv == 'y':
        cprint('Укажи название виртуального окружения: ')
        venv_name = input().strip(' ')
        # проверить есть ли директория ВО
        cprint('Активирую виртуальное окружение...')
        run(f'source {venv_name}/bin/activate')
    cprint('Скачиваю и устанавливаю зависимости...')
    # проверить есть ли файл requirements.txt
    run('pip install -r requirements.txt')
    cprint('Введите ТОКЕН вашего Telegram-бота. Скрипт запишет это значение в переменную окружения. ')
    token = input().strip(' ')
    cprint('Введите ID чата админа бота. Это значение можно узнать только в переписке с вашим ботом.\n'
           'Если вы не знаете этого значения, введите 0. ')
    admin_chat_id = int(input().strip(' '))
    if admin_chat_id == 0:
        with open('find_out_admin_chat_id.py', 'w') as f:
            f.write(f'import telebot\n\nTOKEN = {token}\nbot = telebot.TeleBot(TOKEN)\n\n'
                    "@bot.message_handler(commands=['start'])\n"
                    "def start(message):\n    bot.send_message(message.chat.id, str(message.chat.id))\n\n"
                    "bot.polling()")
        run('python3 find_out_admin_chat_id.py')
        cprint('Отправь своему боту сообщение с текстом /start. В ответ он отправит ID твоего чата. '
               'Можешь использовать этот CHAT_ID как админский. Отправь мне его: ')
        admin_chat_id = int(input().strip(' '))
        run('rm find_out_admin_chat_id.py')
    if is_venv == 'y':
        with open(f'{venv_name}/bin/activate', 'a') as f:
            f.write(f'export TOKEN="{token}"\nexport ADMIN_CHAT_ID="{admin_chat_id}"')
        with open(f'{venv_name}/bin/deactivate', 'a') as f:
            f.write('unset TOKEN\nunset ADMIN_CHAT_ID')
    else:
        run(f'export TOKEN="{token}"\nexport ADMIN_CHAT_ID="{admin_chat_id}"')
        cprint('Для того, чтобы изменить значение переменной окружения используй:\n'
               'export TOKEN="Значение"\n'
               'export ADMIN_CHAT_ID="Значение"')


if __name__ == '__main__':
    setup()


# apt-get install cron
# cron config
