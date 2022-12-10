from selenium import webdriver
from selenium.webdriver import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import datetime


class SiteParser:
    CITY_DATA = {
        "Шумилино": "c621986",
        "Витебск": "c620127",
        "Минск": "c625144"
    }

    def __init__(self, headless: bool = True):
        self.cap = DesiredCapabilities.CHROME
        # self.cap["pageLoadStrategy"] = "eager"
        self.options = Options()
        self.options.headless = headless
        self.options.add_experimental_option("prefs", {'profile.managed_default_content_settings.javascript': 3})

    def is_input_correct(self, city_from: str = None, city_to: str = None,
                         date: str = None, departure_time: str = None):
        if date and datetime.date(int(date.split('-')[0]), int(date.split('-')[1]), int(date.split('-')[2])) < \
                datetime.date.today():
            return False
        if departure_time:
            url = self.prepare_url(city_from, city_to, date)
            if departure_time not in self.get_page_text(url=url):
                return False
        return True


    def prepare_url(self, city_from: str, city_to: str, date: str):
        key_from = self.CITY_DATA.get(city_from)
        key_to = self.CITY_DATA.get(city_to)
        passengers = '1'
        return f'https://v-minsk.com/Маршруты/{city_from}/{city_to}?date={date}&passengers={passengers}&from={key_from}&to={key_to}'

    def get_page_text(self, url: str):
        driver = webdriver.Chrome(options=self.options, desired_capabilities=self.cap)
        driver.set_window_size(1070, 500)
        driver.get(url)
        text = driver.find_element(By.CLASS_NAME, 'MuiGrid-grid-lg-9').text.split('\n')
        driver.quit()
        return text

    def check_buses(self, city_from: str, city_to: str, date: str):
        url = self.prepare_url(city_from, city_to, date)
        text = self.get_page_text(url=url)
        return False if 'Билеты не найдены' or 'Рейсов не найдено' in text else True

    def is_available_buses(self, text: list):
        if 'Рейсов не найдено' in text or 'Билеты не найдены' in text:
            return False
        else:
            return True

    def parse(self, city_from: str, city_to: str, date: str):
        url = self.prepare_url(city_from, city_to, date)
        text = self.get_page_text(url=url)
        if not self.is_available_buses(text):
            return {}
        response = {}
        i_begin = 0
        counter = 1
        c = 1 if str(datetime.date.today()) != date else 0  # correction
        while len(text[i_begin]) == 5:
            if 'Нет мест' in text[i_begin + 6+c]:
                response.update({
                    counter: {
                        'departure_time': text[i_begin],
                        'arrival_time': text[i_begin + 3+c],
                        'cost': None,
                        'free_places_info': 'Нет мест'
                    }})
                i_begin += 10+c
            elif 'Br' in text[i_begin + 6+c]:
                response.update({
                    counter: {
                        'departure_time': text[i_begin],
                        'arrival_time': text[i_begin + 3+c],
                        'cost': text[i_begin + 6+c],
                        'free_places_info': text[i_begin + 8+c]
                    }})
                i_begin += 13+c
            else:
                break
            counter += 1
        return response

    def get_free_seats(self, city_from: str, city_to: str, date: str, departure_time: str):
        url = self.prepare_url(city_from, city_to, date)
        text = self.get_page_text(url=url)
        c = 1 if str(datetime.date.today()) != date else 0  # correction
        date_index = text.index(departure_time)
        if 'Br' in text[date_index + 6+c]:
            return text[date_index + 8+c]
        else:
            return 0
