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