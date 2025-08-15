# PowerShell script to start development server
Write-Host "Starting ChatBot development server..." -ForegroundColor Green
Set-Location "chatbot-app"
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow

# Stop any existing containers on port 3000
$existingContainer = docker ps --filter "publish=3000" --format "{{.ID}}"
if ($existingContainer) {
    Write-Host "Stopping existing container on port 3000..." -ForegroundColor Yellow
    docker stop $existingContainer
}

# Start the server
Write-Host "Starting new development server..." -ForegroundColor Yellow
docker run --rm -v "${PWD}:/app" -w /app -p 3000:3000 node:18 npm run dev
