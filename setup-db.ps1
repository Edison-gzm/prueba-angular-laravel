# Ejecutar migraciones y seeders para tener datos de prueba.
# Uso: .\setup-db.ps1
# Requiere: Docker en marcha y contenedores levantados (docker-compose up -d)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Ejecutando migraciones y seeders en el contenedor backend..." -ForegroundColor Cyan
docker-compose exec backend php artisan migrate --seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Asegurate de tener los contenedores levantados: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}
Write-Host "Listo. Usuarios de prueba: admin@prueba.com, usuario@prueba.com, maria@prueba.com (password: Password1!)" -ForegroundColor Green
