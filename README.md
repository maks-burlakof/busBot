# Bot for reminders to order transport tickets
Telegram bot, which is designed to make life easier for those who uses the services of [route.by](https://route.by/), travels by minibuses and forget to book them. 
The bot will remind you in Telegram when the selected minibuses are available for order.

## Features
- user registration
- processing user requests
- logging and error processing

### Features for all users
- receive notifications about the availability of selected minibuses
- receiving information from the order page on the site [route.by](https://route.by/)
- receive notifications about the availability of free seats on the selected minibuses
- setting unique parameters:
	- polling frequency from the site
- send message to administrator

### Administrator features
- all the features of ordinary users
- sending announcements to all bot users
  - ordinary text
  - with automatic styling about the availability of selected minibuses

## Installation and launch
```bash
git clone https://github.com/maks-burlakof/bus_bot.git
cd bus_bot
python3 main.py
```
User notification is implemented using the worker/notifier.py script. 
Cron is used to automatically run the notifier_executor.py script on linux systems. 
Check if cron is installed on your system using:
```bash
sudo apt install cron
```
For cron configuration use:
```bash
crontab -e
0 0 * * * python3 /home/maksim/python/marshrutka/workers/notifier_executor.py
```