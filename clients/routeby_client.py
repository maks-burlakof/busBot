import requests
from bs4 import BeautifulSoup


class SiteParser:
    def __init__(self, user_actioner):
        user_actioner.setup()
        self.city_data = user_actioner.get_city_data()
        user_actioner.shutdown()

    def prepare_url(self, city_from: str, city_to: str, date: str):
        key_from = self.city_data.get(city_from)
        key_to = self.city_data.get(city_to)
        passengers = '1'
        return f'https://v-minsk.com/Маршруты/{city_from}/{city_to}?date={date}&passengers={passengers}&from={key_from}&to={key_to}'

    def parse(self, city_from: str, city_to: str, date: str):
        url = self.prepare_url(city_from, city_to, date)
        page = requests.get(url)
        soup = BeautifulSoup(page.text, "html.parser")
        content = soup.find('div', class_='MuiGrid-grid-lg-9')
        if 'Рейсов не найдено' in content.text or 'Билеты не найдены' in content.text:
            return {}
        response = {}
        counter = 1
        routes = content.findAll('div', 'MuiGrid-root MuiGrid-container')
        for route in routes:
            times = route.findAll('div', 'MuiGrid-grid-md-3')
            availability = route.find('div', 'MuiGrid-grid-md-auto').text
            free_phrase = 'Свободно' if 'Свободно' in availability else 'Последнее'
            response.update({
                counter: {
                    'departure_time': times[0].text[:5],
                    'arrival_time': times[1].text[:5],
                    'cost': (availability[:availability.find('Br')] + 'Br') if availability else None,
                    'free_places_info': availability[availability.find(free_phrase):] if availability else 'Нет мест'
                }})
            counter += 1
        return response

    def get_free_seats(self, city_from: str, city_to: str, date: str, departure_time: str):
        response = self.parse(city_from, city_to, date)
        for bus in response:
            if departure_time == response[bus]['departure_time'] and response[bus]['free_places_info'] != 'Нет мест':
                return response[bus]['free_places_info']
        return 0
