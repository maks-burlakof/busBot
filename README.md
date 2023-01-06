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
	- polling frequency from the site (Status: in development)
- send message to administrator

### Administrator features
- all the features of ordinary users
- sending announcements to all bot users
  - ordinary text
  - with automatic styling about the availability of selected minibuses (Status: in development)
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
sudo apt-get install language-pack-ru-base
python3 main.py
deactivate
```
After successfully launching the bot, you need to add authorized users to the newly created sqlite3 database - `users.db`. This can be done in several ways, but I recommend directly accessing the database in the console using the `sqlite3` utility. To install it in Unix systems, use
```bash
sudo apt install sqlite3
```
Then open the database via
```bash
sqlite3 users.db
```
Using an SQL query, let's add the first allowed user - ourselves! - to the user_whitelist table. Use
```sql
INSERT INTO user_whitelist (username) VALUES ("your-username");
```
where in the quotes instead of `your-username` specify your Telegram nickname **without** the @ sign. Done! Now the bot knows that you are on the whitelist and will allow you to use all its advantages!

The next step in the configuration is to set the `ADMIN_CHAT_ID` environment variable, if you did not set this value when creating the environment variables earlier. In the created database, a `chat id` appeared with you as the first user. We need this value. With another SQL query, we will find out this value:
```sql
SELECT username, chat_id FROM users
```
The answer will be a list of values, one of which is your Telegram username and the other is your `chat id`. Copy this value and specify it in the environment variable that you created a few steps earlier.
Done! Configuration complete!

### Setting values for environment variables 
Open the ``venv/bin/activate`` file and add to the end:
```bash
export PYTHONPATH=${PROJ_DIR}:${PYTHONPATH}
export TOKEN="VALUE"
export ADMIN_CHAT_ID="VALUE"
```
where instead of ``VALUE`` insert your values. If you don't know which ADMIN_CHAT_ID to specify, leave this field blank, we will set this value later. 
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

## Project disadvantages
This project was created for a small amount of users. The main limitation is that all requests to the external site are executed sequentially, single-threaded on one server. I may partially rewrite the modules that perform background requests to the route site, and implement multithreading to reduce the response time from the site, provided that the project will become popular and there will be such a need. At this point in time, the scripts can process the number of requests that I need.