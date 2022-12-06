from selenium import webdriver
from selenium.webdriver import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import json


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
        return False if 'Билеты не найдены' in text else True

    def parse(self, city_from: str, city_to: str, date: str):
        url = self.prepare_url(city_from, city_to, date)
        text = self.get_page_text(url=url)
        response = {}
        i_begin = 0
        counter = 1
        while len(text[i_begin]) == 5:
            if 'Нет мест' in text[i_begin + 7]:
                response.update({
                    counter: {
                        'departure_time': text[i_begin],
                        'arrival_time': text[i_begin + 4],
                        'cost': None,
                        'free_places_info': text[i_begin + 7]
                    }})
                i_begin += 11
            elif 'Br' in text[i_begin + 7]:
                response.update({
                    counter: {
                        'departure_time': text[i_begin],
                        'arrival_time': text[i_begin + 4],
                        'cost': text[i_begin + 7],
                        'free_places_info': text[i_begin + 9]
                    }})
                i_begin += 14
            counter += 1
        return response
