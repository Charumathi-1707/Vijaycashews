# Cleanup old root files after reorganization
# This removes the old root-level src, public, and config files

$root = "e:\vijay cashew landing page\Vijaycashews"

Write-Host "Cleaning up old root-level files..." -ForegroundColor Green

# Items to remove
$itemsToRemove = @(
    "src",
    "public",
    "index.html",
    "package.json",
    "vite.config.js",
    "eslint.config.js",
    ".env",
    ".env.example"
)

foreach ($item in $itemsToRemove) {
    $fullPath = Join-Path $root $item
    if (Test-Path $fullPath) {
        Remove-Item -Path $fullPath -Recurse -Force
        Write-Host "Removed: $item" -ForegroundColor Yellow
    }
}

Write-Host "`n" -ForegroundColor Green
Write-Host "Cleanup complete! Your project structure is now:" -ForegroundColor Green
Write-Host ""
Write-Host "Vijaycashews/" -ForegroundColor White
Write-Host "├── backend/" -ForegroundColor Cyan
Write-Host "│   ├── models/" -ForegroundColor Gray
Write-Host "│   ├── controllers/" -ForegroundColor Gray
Write-Host "│   ├── routes/" -ForegroundColor Gray
Write-Host "│   ├── server.js" -ForegroundColor Gray
Write-Host "│   └── package.json" -ForegroundColor Gray
Write-Host "│" -ForegroundColor White
Write-Host "├── frontend/" -ForegroundColor Cyan
Write-Host "│   ├── src/" -ForegroundColor Gray
Write-Host "│   ├── public/" -ForegroundColor Gray
Write-Host "│   ├── index.html" -ForegroundColor Gray
Write-Host "│   ├── package.json" -ForegroundColor Gray
Write-Host "│   └── vite.config.js" -ForegroundColor Gray
Write-Host "│" -ForegroundColor White
Write-Host "└── internals/" -ForegroundColor Cyan
Write-Host "    └── appscript.txt" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Update frontend: cd frontend && npm install && npm run dev" -ForegroundColor White
Write-Host "2. Update backend: cd backend && npm install && npm run dev" -ForegroundColor White
