<#
.SYNOPSIS
  Starts the Consolidated Unified Backend (or legacy microservices) and the Next.js frontend for SOCIAL-X.

.DESCRIPTION
  Single Unified Backend (Port 8000 with transparent forwarders on 8001, 8002, 8003, 8004):
    - Core Service (Auth, Users, Identity)
    - Social-X Gateway & AI (OCR, Speech-to-Text)
    - Routing & Governance Workflow Engine (8-stage state machine, Matchmaking)
    - Central Analytics, Reports, Notifications & WebSocket Live Feed
    - Next.js 16 Web Application: http://localhost:3000
#>

param(
  [switch]$FrontendOnly,
  [switch]$BackendsOnly,
  [switch]$LegacyMode
)

$RootDir = $PSScriptRoot
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  SOCIAL-X Civic Operating System - Consolidated Runner   " -ForegroundColor Cyan
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

# 1. Start Backend(s)
if (-not $FrontendOnly) {
  if ($LegacyMode) {
    Write-Host "`n[Legacy Mode] Starting 4 Separate Microservices..." -ForegroundColor Yellow
    
    # Backend 1: Core Service
    $B1_Path = Join-Path $RootDir "SIH BACKEND 1\backend\services\core-service"
    $B1_PythonPath = Join-Path $RootDir "SIH BACKEND 1\backend"
    Start-ServiceConsole -Title "Backend 1: Core Service (8001)" -WorkingDirectory $B1_Path -Command "[System.Environment]::SetEnvironmentVariable('PYTHONPATH', '$B1_PythonPath'); python -m uvicorn app.main:app --port 8001 --reload"

    # Backend 2: Social-X Gateway & AI
    $B2_Path = Join-Path $RootDir "sih backend 2"
    Start-ServiceConsole -Title "Backend 2: Social-X Gateway & AI (8002)" -WorkingDirectory $B2_Path -Command "[System.Environment]::SetEnvironmentVariable('PYTHONPATH', '$B2_Path'); python -m uvicorn backend.main:app --port 8002 --reload"

    # Backend 3: Routing & Workflow
    $B3_Path = Join-Path $RootDir "SIH BACKEND 3\backend\services\routing-service"
    $B3_PythonPath = Join-Path $RootDir "SIH BACKEND 3\backend"
    Start-ServiceConsole -Title "Backend 3: Routing & Workflow (8003)" -WorkingDirectory $B3_Path -Command "[System.Environment]::SetEnvironmentVariable('PYTHONPATH', '$B3_PythonPath'); python -m uvicorn main:app --port 8003 --reload"

    # Backend 4: Analytics & Notifications
    $B4_Path = Join-Path $RootDir "SIH BACKEND 4"
    Start-ServiceConsole -Title "Backend 4: Analytics & Notifications (8004)" -WorkingDirectory $B4_Path -Command "python -m uvicorn app.main:app --port 8004 --reload"
  } else {
    Write-Host "`n[Consolidated Backend] Starting Unified Social-X Backend (Port 8000 + 8001-8004)..." -ForegroundColor Green
    Start-ServiceConsole -Title "Social-X Unified Backend (Port 8000/8001-8004)" -WorkingDirectory $RootDir -Command "python unified_backend.py"
  }
}

# 2. Frontend: Next.js
if (-not $BackendsOnly) {
  Write-Host "`n[Frontend] Starting Next.js Web App on Port 3000..." -ForegroundColor Yellow
  $Frontend_Path = Join-Path $RootDir "NEW FRONTEND SIH"
  Start-ServiceConsole -Title "Frontend: Next.js App (3000)" -WorkingDirectory $Frontend_Path -Command "pnpm run dev"
}

Write-Host "`nServices Successfully Spawned!" -ForegroundColor Green
Write-Host "Services Map:" -ForegroundColor Gray
Write-Host "  - Frontend:        http://localhost:3000" -ForegroundColor White
Write-Host "  - Unified Backend: http://localhost:8000 (Swagger: /docs)" -ForegroundColor White
Write-Host "  - Core APIs:       http://localhost:8000/api/v1 (or port 8001)" -ForegroundColor White
Write-Host "  - Gateway & AI:    http://localhost:8000/api (or port 8002)" -ForegroundColor White
Write-Host "  - Routing Engine:  http://localhost:8000/api/v1 (or port 8003)" -ForegroundColor White
Write-Host "  - Analytics & WS:  http://localhost:8000/dashboard (or port 8004)" -ForegroundColor White
Write-Host "  - Live Stream:     ws://localhost:8000/live (or ws://localhost:8004/live)" -ForegroundColor White

