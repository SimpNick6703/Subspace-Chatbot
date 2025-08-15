# Build the application for production using Docker
Write-Host "Building ChatBot application for production..." -ForegroundColor Green

# Navigate to the app directory
Set-Location "chatbot-app"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
$installResult = docker run --rm -v "${PWD}:/app" -w /app node:18 npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
$buildResult = docker run --rm -v "${PWD}:/app" -w /app node:18 npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build failed" -ForegroundColor Red
    exit 1
}

# Check if dist folder was created
if (Test-Path "dist") {
    Write-Host "Build complete! Files are in the 'dist' directory." -ForegroundColor Green
    Write-Host "You can now deploy the 'dist' folder to Netlify or any static hosting service." -ForegroundColor Green
} else {
    Write-Host "Error: Build failed - 'dist' directory was not created" -ForegroundColor Red
    exit 1
}
