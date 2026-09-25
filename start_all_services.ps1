<#
.SYNOPSIS
  Starts all 4 backend microservices and the Next.js frontend for the SOCIAL-X Platform.

.DESCRIPTION
  Ports allocation:
    - Backend 1 (Core Service - Auth, Users, Issues):            http://localhost:8001
    - Backend 2 (Social-X Gateway & AI OCR/Speech):              http://localhost:8002
    - Backend 3 (Routing & Governance Workflow Engine):          http://localhost:8003
    - Backend 4 (Analytics, Reports & WebSocket Notification):  http://localhost:8004
    - Frontend  (Next.js 16 Web Application):                   http://localhost:3000
#>

param(
  [switch]$FrontendOnly,
  [switch]$BackendsOnly
)

$RootDir = $PSScriptRoot
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SOCIAL-X Civic Operating System - Multi-Service Runner  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Root Directory: $RootDir" -ForegroundColor Gray

function Start-ServiceConsole {
  param (
    [string]$Title,
    [string]$WorkingDirectory,
    [string]$Command
  )
  $script = @"
`$host.UI.RawUI.WindowTitle = '$Title'
Set-Location '$WorkingDirectory'
$Command
"@
  $bytes = [System.Text.Encoding]::Unicode.GetBytes($script)
  $encoded = [Convert]::ToBase64String($bytes)
  Start-Process powershell.exe -ArgumentList "-NoExit", "-EncodedCommand", $encoded -WindowStyle Normal
}

# 1. Backend 1: Core Service
if (-not $FrontendOnly) {
  Write-Host "`n[1/4] Starting Backend 1: Core Service on Port 8001..." -ForegroundColor Green
  $B1_Path = Join-Path $RootDir "SIH BACKEND 1\backend\services\core-service"
  $B1_PythonPath = Join-Path $RootDir "SIH BACKEND 1\backend"
  Start-ServiceConsole -Title "Backend 1: Core Service (8001)" -WorkingDirectory $B1_Path -Command "[System.Environment]::SetEnvironmentVariable('PYTHONPATH', '$B1_PythonPath'); python -m uvicorn app.main:app --port 8001 --reload"
}

# 2. Backend 2: Social-X Core Gateway & AI
if (-not $FrontendOnly) {
  Write-Host "[2/4] Starting Backend 2: Social-X Gateway & AI on Port 8002..." -ForegroundColor Green
  $B2_Path = Join-Path $RootDir "sih backend 2"
  Start-ServiceConsole -Title "Backend 2: Social-X Gateway & AI (8002)" -WorkingDirectory $B2_Path -Command "[System.Environment]::SetEnvironmentVariable('PYTHONPATH', '$B2_Path'); python -m uvicorn backend.main:app --port 8002 --reload"
}

# 3. Backend 3: Routing & Workflow Engine
if (-not $FrontendOnly) {
  Write-Host "[3/4] Starting Backend 3: Routing & Workflow on Port 8003..." -ForegroundColor Green
  $B3_Path = Join-Path $RootDir "SIH BACKEND 3\backend\services\routing-service"
  $B3_PythonPath = Join-Path $RootDir "SIH BACKEND 3\backend"
  Start-ServiceConsole -Title "Backend 3: Routing & Workflow (8003)" -WorkingDirectory $B3_Path -Command "[System.Environment]::SetEnvironmentVariable('PYTHONPATH', '$B3_PythonPath'); python -m uvicorn main:app --port 8003 --reload"
}

# 4. Backend 4: Central Analytics & Notification Service
if (-not $FrontendOnly) {
  Write-Host "[4/4] Starting Backend 4: Analytics & Notifications on Port 8004..." -ForegroundColor Green
  $B4_Path = Join-Path $RootDir "SIH BACKEND 4"
  Start-ServiceConsole -Title "Backend 4: Analytics & Notifications (8004)" -WorkingDirectory $B4_Path -Command "python -m uvicorn app.main:app --port 8004 --reload"
}

# 5. Frontend: Next.js
if (-not $BackendsOnly) {
  Write-Host "`n[Frontend] Starting Next.js Web App on Port 3000..." -ForegroundColor Yellow
  $Frontend_Path = Join-Path $RootDir "NEW FRONTEND SIH"
  Start-ServiceConsole -Title "Frontend: Next.js App (3000)" -WorkingDirectory $Frontend_Path -Command "pnpm run dev"
}

Write-Host "`nAll requested services have been spawned in separate PowerShell windows!" -ForegroundColor Green
Write-Host "Services Map:" -ForegroundColor Gray
Write-Host "  - Frontend:   http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend 1:  http://localhost:8001/api/v1 (Core Service)" -ForegroundColor White
Write-Host "  - Backend 2:  http://localhost:8002/api (Social-X & AI)" -ForegroundColor White
Write-Host "  - Backend 3:  http://localhost:8003/api/v1 (Routing Engine)" -ForegroundColor White
Write-Host "  - Backend 4:  http://localhost:8004 (Analytics & Notifications)" -ForegroundColor White
Write-Host "  - Live Stream: ws://localhost:8004/live (WebSockets)" -ForegroundColor White
