FROM python:3.10

RUN apt-get update && apt-get install -y locales locales-all sqlite3 && mkdir /bus-bot

WORKDIR /bus-bot
ADD . /bus-bot/
RUN pip install -r requirements.txt

ENV LC_ALL ru_RU.UTF-8
ENV LANG ru_RU.UTF-8
ENV LANGUAGE ru_RU.UTF-8

CMD ["python3", "/bus-bot/main.py"]