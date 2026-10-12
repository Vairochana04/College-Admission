# =============================================================
#  CampusConnect - Windows starter script (VS Code friendly)
#  How to use:
#    1) Open this folder in VS Code  (File > Open Folder)
#    2) Terminal > New Terminal      (Ctrl + `)
#    3) Type:  powershell -ExecutionPolicy Bypass -File .\start-server.ps1
#       (or just:  .\start-server.ps1)
#    4) Browser: http://localhost:8080   (use Incognito first time)
#  Logins: student@demo.edu/student123   admin@demo.edu/admin123
# =============================================================

# --- 0) stop any OLD server still holding port 8080 -------------
# (old server = old website = "gap page" / old admin dashboard)
Write-Host ">> Stopping any old Java server..." -ForegroundColor Yellow
taskkill /F /IM java.exe 2>$null

# --- helper: find a working python (python / py / python3) -------
function Find-Python {
    foreach ($c in @('python', 'py', 'python3')) {
        $cmd = Get-Command $c -ErrorAction SilentlyContinue
        if ($cmd) { return $c }
    }
    return $null
}

# --- helper: start the python mirror backend (no JDK needed) -----
function Start-PythonBackend {
    $py = Find-Python
    if (-not $py) {
        Write-Host "!! No Java JDK and no Python found on this PC." -ForegroundColor Red
        Write-Host "!! Install ONE of these, then run this script again:" -ForegroundColor Red
        Write-Host "!!   JDK 17  : https://adoptium.net" -ForegroundColor Cyan
        Write-Host "!!   Python  : https://www.python.org/downloads/ (tick 'Add python.exe to PATH')" -ForegroundColor Cyan
        return $false
    }
    Write-Host ">> Starting Python mirror backend on http://localhost:8080 ..." -ForegroundColor Green
    Write-Host ">> Logins: student@demo.edu/student123  admin@demo.edu/admin123" -ForegroundColor Cyan
    Set-Location "$PSScriptRoot"
    & $py preview\cc_preview.py
    return $true
}

# --- 1) Java route: compile + run (preferred) ---------------------
$javac = Get-Command javac -ErrorAction SilentlyContinue
if ($javac) {
    Set-Location "$PSScriptRoot\server"
    Write-Host ">> Compiling Server.java ..." -ForegroundColor Yellow
    javac Server.java
    if ($LASTEXITCODE -eq 0) {
        Write-Host ">> Starting Java server on http://localhost:8080 ..." -ForegroundColor Green
        Write-Host ">> Logins: student@demo.edu/student123  admin@demo.edu/admin123" -ForegroundColor Cyan
        java Server
        exit 0
    }
    Write-Host "!! Java compile failed - falling back to the Python mirror..." -ForegroundColor Red
} else {
    Write-Host "!! javac not found - using the Python mirror backend..." -ForegroundColor Yellow
}

# --- 2) Python fallback -------------------------------------------
$ok = Start-PythonBackend
if (-not $ok) { exit 1 }

# --- 3) to stop the server: press Ctrl+C in this terminal ---------
