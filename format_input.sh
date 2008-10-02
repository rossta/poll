#!/bin/sh
/usr/bin/cut -d, -f 1,2,3,4,5,6 | /usr/bin/grep -e "\(S[tu][am][ts]\)" -v | /usr/bin/tee "archive/polls-$(date +%F).csv" | /usr/bin/tee latest_polls.csv
