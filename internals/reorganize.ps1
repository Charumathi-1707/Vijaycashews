# Reorganize Project Structure
# This script moves frontend files to the frontend folder

# Set the root path
$root = "e:\vijay cashew landing page\Vijaycashews"

Write-Host "Reorganizing project structure..." -ForegroundColor Green

# Copy src folder
Write-Host "Moving src folder..." -ForegroundColor Yellow
if (Test-Path "$root\src") {
    Copy-Item -Path "$root\src\*" -Destination "$root\frontend\src" -Recurse -Force
    Write-Host "✓ src folder copied" -ForegroundColor Green
}

# Copy public folder
Write-Host "Moving public folder..." -ForegroundColor Yellow
if (Test-Path "$root\public") {
    Copy-Item -Path "$root\public\*" -Destination "$root\frontend\public" -Recurse -Force
    Write-Host "✓ public folder copied" -ForegroundColor Green
}

Write-Host "`nProject structure reorganization complete!" -ForegroundColor Green
Write-Host "`nNew structure:" -ForegroundColor Cyan
Write-Host "Vijaycashews/" -ForegroundColor White
Write-Host "  backend/" -ForegroundColor White
Write-Host "  frontend/" -ForegroundColor White
Write-Host "    src/" -ForegroundColor White
Write-Host "    public/" -ForegroundColor White
Write-Host "    index.html" -ForegroundColor White
Write-Host "    package.json" -ForegroundColor White
Write-Host "    vite.config.js" -ForegroundColor White
Write-Host "  internals/" -ForegroundColor White
Write-Host "`nYou can now delete the old root-level files:" -ForegroundColor Yellow
Write-Host "- src/ (old)" -ForegroundColor Gray
Write-Host "- public/ (old)" -ForegroundColor Gray
Write-Host "- index.html (old)" -ForegroundColor Gray
Write-Host "- package.json (old at root)" -ForegroundColor Gray
Write-Host "- vite.config.js (old)" -ForegroundColor Gray
Write-Host "- eslint.config.js (old)" -ForegroundColor Gray
