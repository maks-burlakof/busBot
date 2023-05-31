# Bot for reminders to order transport tickets

Telegram bot, which is designed to make life easier for those who uses the services of [route.by](https://route.by/), travels by minibuses and forget to book them.
The bot will remind you in Telegram when the selected minibuses are available for order.

## Features

- user registration
  - from the white list
  - by invitation codes
- processing user requests
- logging and error processing

### Features for all users

- receive notifications about the availability of selected minibuses
- receiving information from the order page on the site [route.by](https://route.by/)
- receive notifications about the availability of free seats on the selected minibuses
- send message to administrator

### Administrator features

- all the features of ordinary users
- sending announcements to all bot users
- work with users
  - see the list of registered users
  - ban users
- view the contents of the database
- view the log file, clear it
- view available invitation codes

## Installation and launch

### Docker

```bash
docker build -t bus-bot .
docker run --name bus-bot-container bus-bot
```

### Manually

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
sudo apt-get install -y language-pack-ru-base
# or sudo apt-get install -y locales locales-all
nohup python3 main.py &
```

The next step is to create a `.env` file and specify *TOKEN* and *ADMIN_CHAT_ID* variables.

You can retrieve your Telegram ID in many ways (look up in the google). Copy this value and specify it in the environment variable.

Done! Configuration complete!

### Cron configurations

User notification is implemented using the worker/reminder.py script. Cron is used to automatically run the notifier_executor.py and tracker_executor.py scripts on unix systems.

Check if cron is installed on your system using:

```bash
sudo apt-get install cron
```

Configure the cron file using:

```bash
crontab -e
0 0 * * * command1
* * * * * command2
```

## Project disadvantages

A main.py file in release 2.0 contains total bullshit code aka govnokod. I should to completely rewrite project, e.g. create classes Track, Parse, Notify and basic class. Maybe later, when I have the strength and desire.

This project was created for a small amount of users. The main limitation is that all requests to the external site are executed sequentially, single-threaded on one server. I may partially rewrite the modules that perform background requests to the route site, and implement multithreading to reduce the response time from the site, provided that the project will become popular and there will be such a need. At this point in time, the scripts can process the number of requests that I need.
