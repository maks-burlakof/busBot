# Installation

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

sudo apt-get install language-pack-ru-base
# or sudo apt-get install -y locales locales-all
```

Create the `.env` file with the following content:

```text
TOKEN="<token>"
ADMIN_CHAT_ID="<chat-id>"
PYTHONPATH=${PROJ_DIR}:${PYTHONPATH}
```

### Cron setup

1. Create the .sh scripts track.sh and notify.sh. 

```text
#!/usr/bin/env bash

cd /root/bus_bot/
source venv/bin/activate
python3 worker/reminder.py -a track
deactivate
```

Make them executable:

```bash
chmod +x track.sh
```

2. Install cron jobs:

```bash
sudo apt-get install cron
crontab -e
```

Paste to the end:

```text
0 0 * * * /bin/bash /home/user/bus_bot/worker/notify.sh
* * * * * /bin/bash /home/user/bus_bot/worker/track.sh
```

You can replace `/bin/bash` with simple `bash` according to your system.

### Configure Supervisor

1. Create the file `configs/bot_start.sh` with your `DIR` and `VENV` paths like this:

```text
#!/bin/bash

DIR=/root/bus_bot
VENV=$DIR/venv/bin/activate

cd $DIR
source $VENV
exec python main.py
```

Make sure that your file is executable:

```bash
chmod u+x configs/bot_start.sh
```

2. Install the supervisor:

```bash
sudo apt install supervisor
sudo systemctl enable supervisor
sudo systemctl start supervisor

sudo nano /etc/supervisor/conf.d/bus-bot.conf
```

Paste the following configuration:  
Update the `command` variable with your path to the script, `stdout_logfile` with the path to the logs directory, `user` with your system username.

```text
[program:bus-bot]
command=/root/bus_bot/configs/bot_start.sh
user=root
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/root/bus_bot/logs/supervisor_logs.log
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
supervisorctl status
```

## SQLite database

```bash
sudo apt install sqlite3
sqlite3 users.db

SELECT username, chat_id FROM users;
```