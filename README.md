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
- setting unique parameters:
	- polling frequency from the site
- send message to administrator

### Administrator features
- all the features of ordinary users
- sending announcements to all bot users
  - ordinary text
  - with automatic styling about the availability of selected minibuses
- work with users
    - see the list of registered users
    - ban users
- view the contents of the database
- view the log file, clear it
- view available invitation codes

## Installation and launch
```bash
git clone https://github.com/maks-burlakof/bus_bot.git
cd bus_bot
python3 -m venv venv
# set environment variables (below)
source venv/bin/activate
pip install -r requirements.txt
python3 main.py
deactivate
```

### Setting values for environment variables 
Open the ``venv/bin/activate`` file and add to the end:
```bash
export PYTHONPATH=${PROJ_DIR}:${PYTHONPATH}
export TOKEN="VALUE"
export ADMIN_CHAT_ID="VALUE"
```
where instead of ``VALUE`` insert your values.  
The PYTHONPATH setting allows you to import from modules located in parent directories.

Find the ``deactivate()`` function in this file, and add the following to the end of its code:
```bash
unset PYTHONPATH
unset TOKEN
unset ADMIN_CHAT_ID
```
Ready! Now, when you start your virtual environment using ``source venv/bin/activate``, the variables will be set automatically. When closing the virtual environment with ``deactivate``, the values of the variables are reset.

### Cron configurations
User notification is implemented using the worker/reminder.py script. 
Cron is used to automatically run the notifier_executor.py script on linux systems. 
Check if cron is installed on your system using:
```bash
sudo apt install cron
```
For cron configuration use:
```bash
crontab -e
0 0 * * * command1
* * * * * command2
```