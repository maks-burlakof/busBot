import requests


class TelegramClient:
    def __init__(self, token: str, base_url: str):
        self.token = token
        self.base_url = base_url

    def prepare_url(self, method: str):
        result_url = f"{self.base_url}/bot{self.token}/"
        if method is not None:
            result_url += method
        return result_url

    def post(self, method: str = None, params: dict = None, data: dict = None):
        url = self.prepare_url(method)
        resp = requests.post(url, params=params, data=data)
        return resp.json()


if __name__ == '__main__':
    token = 'YOUR TOKEN HERE'
    telegram_client = TelegramClient(token, base_url="https://api.telegram.org")
    my_params = {"chat_id": 0000000, "text": "sampleTEXT"}
    my_data = {"chat_id": 0000000, "text": "sampleTEXT"}
    print(telegram_client.post(method="sendMessage", params=my_params, data=my_data))
