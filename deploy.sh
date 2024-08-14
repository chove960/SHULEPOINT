sudo git pull
sudo nx build shule-point-api --prod
sudo pm2 restart all --update-env

sudo nx build shule-point-web-portal --prod --build-optimizer=true --aot=true

sudo rm -rf /var/www/app.shulepoint.co.tz/assets
cd dist/apps/shule-point-web-portal
sudo cp -r * /var/www/app.shulepoint.co.tz

cd ~/shulepoint
sudo systemctl restart nginx
