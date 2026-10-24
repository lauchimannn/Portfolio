# Setup
dotnet user-secrets init
dotnet user-secrets set "Steam:ApiKey" "50A88FD3AB750F4BE898A6E2648A7CDC"

# Testing
## Backend
cd ChocoPortfolio.Api
dotnet run

## Frontend
cd ChocoPortfolio
npm run dev