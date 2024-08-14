sudo git pull
sudo nx build shule-point-api --prod
sudo pm2 restart all --update-env
sudo pm2 monit
