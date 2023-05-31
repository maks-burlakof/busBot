import requests


class TelegramClient:
    def __init__(self, token: str):
        self.token = token

    def prepare_url(self, method: str):
        result_url = "https://api.telegram.org/bot{}/".format(self.token)
        if method is not None:
            result_url += method
        return result_url

    def post(self, method: str = None, params: dict = None, data: dict = None):
        url = self.prepare_url(method)
        resp = requests.post(url, params=params, data=data)
        return resp.json()
