curl http://www.electoral-vote.com/evp2008/Pres/Excel/today.csv | cut -d, -f 1,2,3,4,5,6 | grep -e "\(S[tu][am][ts]\)" -v | tee "archive/polls-$(date +%F).csv" > latest_polls.csv
