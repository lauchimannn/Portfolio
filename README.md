# Requirements
.NET 10.0
Nginx

# Setup
dotnet user-secrets init
dotnet user-secrets set "Steam:ApiKey" "YOUR_STEAM_API_KEY"

# Testing
## Backend
cd ChocoPortfolio.Api
dotnet run

## Frontend
cd ChocoPortfolio
npm run dev

# Build
## Backend
dotnet publish -c Release -r linux-x64 --self-contained false

sudo rm -r /var/www/portfolio
sudo cp -r /home/ubuntu/portfolio/frontend /var/www/portfolio
sudo systemctl restart nginx

## Frontend
npm install
npm run build

# Run
## Backend
cd /home/ubuntu/portfolio/backend
export Steam__ApiKey='YOUR_STEAM_API_KEY'
dotnet ChocoPortfolio.Api.dll

