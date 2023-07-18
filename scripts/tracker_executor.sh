#!/bin/bash
cd /home/user/python/marshrutka
source venv/bin/activate
python3 workers/tracker_executor.py
deactivate
