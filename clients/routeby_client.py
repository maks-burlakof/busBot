from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import json

def parser(city_from: str, city_to: str, date: str):
    # city_from = city_from.title().strip()
    # city_to = city_to.title().strip()
    # date = date.strip(' ')
    passengers = '1'
    with open('routeby_database.json', 'r', encoding='utf-8') as f:
        data = json.loads(f.read())
        key_from = data.get(city_from)
        key_to = data.get(city_to)

    url = f'https://v-minsk.com/Маршруты/{city_from}/{city_to}?date={date}&passengers={passengers}&from={key_from}&to={key_to}'
    driver = webdriver.Chrome()
    driver.get(url)

    try:
        text = driver.find_element(By.CLASS_NAME, 'MuiGrid-grid-lg-9').text.split('\n')
    except NoSuchElementException:
        return None

    response = {}
    i_begin = 0
    counter = 1

    while len(text[i_begin]) == 5:
        response.update({
            counter: {
                'departure_time': text[i_begin],
                'arrival_time': text[i_begin + 4],
            }})
        if 'Нет мест' in text[i_begin + 7]:
            response.update({
                counter: {
                    'cost': None,
                    'free_places_info': text[i_begin + 7]
                }})
            i_begin += 11
        elif 'Br' in text[i_begin + 7]:
            response.update({
                counter: {
                    'cost': text[i_begin + 7],
                    'free_places_info': text[i_begin + 9]
                }})
            i_begin += 14
        counter += 1
    return response


# print(parser('Шумилино', 'Минск', '2023-01-01'))