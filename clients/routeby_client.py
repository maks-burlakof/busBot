import requests
from bs4 import BeautifulSoup

from bot.message_texts import plural


class SiteParser:
    def __init__(self):
        self.domain = 'https://route.by'
        self.city_data = self.get_cities()

    @staticmethod
    def get_cities() -> dict:
        return {
            'Шумилино': 'c621986',
            'Витебск': 'c620127',
            'Минск': 'c625144',
        }

    def prepare_url(self, city_from: str, city_to: str, date: str):
        key_from = self.city_data.get(city_from)
        key_to = self.city_data.get(city_to)
        passengers = '1'
        return f'{self.domain}/Маршруты/{city_from}/{city_to}?date={date}&passengers={passengers}&from={key_from}&to={key_to}'

    @staticmethod
    def _get_free_seats_text(free_seats: int) -> str:
        if free_seats == 0:
            return 'Нет мест'
        elif free_seats == 1:
            return 'Последнее место'
        else:
            return f"Свободно {free_seats} {plural(free_seats, 'место,места,мест')}"

    def parse(self, city_from: str, city_to: str, date: str):
        url = self.prepare_url(city_from, city_to, date)
        page = requests.get(url)
        soup = BeautifulSoup(page.text, "html.parser")
        content = soup.find('div', class_='MuiGrid-grid-lg-9')

        if 'Рейсов не найдено' in content.text or 'Билеты не найдены' in content.text:
            return {}

        response = {}
        routes = content.findAll('div', 'MuiGrid-root MuiGrid-container')
        for counter, route in enumerate(routes, start=1):
            times = route.findAll('div', 'MuiGrid-grid-md-3')
            availability = route.find('div', 'MuiGrid-grid-md-auto').text

            if 'Свободно' in availability:
                free_seats = int(availability[availability.find('Свободно'):].replace('+', '').split(' ')[1])
            elif 'Последнее место' in availability:
                free_seats = 1
            else:
                free_seats = 0

            response.update({
                counter: {
                    'departure_time': times[0].text[:5],
                    'arrival_time': times[1].text[:5],
                    'price': (int(availability[:availability.find('Br')].strip())) if availability else None,
                    'free_seats': free_seats,
                    'free_seats_text': self._get_free_seats_text(free_seats),
                }})
        return response

    def get_free_seats(self, city_from: str, city_to: str, date: str, departure_time: str):
        response = self.api_parse(city_from, city_to, date)
        for bus in response:
            if departure_time == response[bus]['departure_time']:
                return response[bus]['free_seats']
        return None

    def api_parse(self, city_from: str, city_to: str, date: str):
        key_from = self.city_data.get(city_from)
        key_to = self.city_data.get(city_to)
        passengers = '1'

        data = requests.get(f'{self.domain}/api/search?from_id={key_from}&to_id={key_to}&date={date}&passengers={passengers}')
        response = {}
        if data.status_code == 200:
            for counter, ride in enumerate(data.json()['rides'], start=1):
                response.update({
                    counter: {
                        'departure_time': ride['departure'][-8:-3],
                        'arrival_time': ride['arrival'][-8:-3],
                        'price': int(ride['price']),
                        'free_seats': int(ride['freeSeats']),
                        'free_seats_text': self._get_free_seats_text(int(ride['freeSeats'])),

                        'name': ride['name'],
                        'driver': ride['driver'],
                        'departure_stops': [{'name': stop['desc'], 'time': stop['datetime'][-8:-3]} for stop in
                                            ride['dischargeStops']],
                        'arrival_stops': [{'name': stop['desc'], 'time': stop['datetime'][-8:-3]} for stop in
                                          ride['pickupStops']],
                        'status': ride['status'],
                    }
                })
        return response
