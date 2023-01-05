import datetime
from selenium import webdriver
from selenium.webdriver import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By


class SiteParser:
    def __init__(self, user_actioner, headless: bool = True):
        user_actioner.setup()
        self.city_data = user_actioner.get_city_data()
        user_actioner.shutdown()
        self.cap = DesiredCapabilities.CHROME
        # self.cap["pageLoadStrategy"] = "eager"
        self.options = Options()
        self.options.headless = headless
        self.options.add_experimental_option("prefs", {'profile.managed_default_content_settings.javascript': 3})

    def prepare_url(self, city_from: str, city_to: str, date: str):
        key_from = self.city_data.get(city_from)
        key_to = self.city_data.get(city_to)
        passengers = '1'
        return f'https://v-minsk.com/Маршруты/{city_from}/{city_to}?date={date}&passengers={passengers}&from={key_from}&to={key_to}'

    def get_page_text(self, url: str):
        driver = webdriver.Chrome(options=self.options, desired_capabilities=self.cap)
        driver.set_window_size(1070, 500)
        driver.get(url)
        text = driver.find_element(By.CLASS_NAME, 'MuiGrid-grid-lg-9').text.split('\n')
        driver.quit()
        return text

    def parse(self, city_from: str, city_to: str, date: str):
        url = self.prepare_url(city_from, city_to, date)
        text = self.get_page_text(url=url)
        if 'Рейсов не найдено' in text or 'Билеты не найдены' in text:
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
        try:
            date_index = text.index(departure_time)
        except ValueError:
            return 0
        if 'Br' in text[date_index + 6+c]:
            return text[date_index + 8+c]
        else:
            return 0
