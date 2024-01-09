from telebot.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo


def token_webapp_keyboard():
    web_app = WebAppInfo("https://busbot.burlakov.live/find")
    keyboard = InlineKeyboardMarkup()
    keyboard.add(InlineKeyboardButton(text='Открыть', web_app=web_app))
    return keyboard
