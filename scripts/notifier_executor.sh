#!/bin/bash
cd /home/user/bus_bot/
source venv/bin/activate
python3 workers/notifier_executor.py
deactivate
