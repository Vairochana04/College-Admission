@echo off
cd /d "%~dp0server"
title CampusConnect - Java server
echo ============================================================
echo   CampusConnect   ^|   Java backend + React frontend
echo   Server:  http://localhost:8080
echo ============================================================
echo.
echo  React app already build aagi dist/ la irukku - Java adha serve pannum.
echo  (React source-a maathina: cd app, npm install, npm run build)
echo.

set JAVA=
java -version >nul 2>&1
if %errorlevel% EQU 0 set JAVA=java
if defined JAVA goto havejava

echo  ------------------------------------------------------------
echo   Java kaanala (Java was not found on this PC).
echo.
echo   JDK 17 (illa 21) install pannunga - java.com illa:
echo       winget install Microsoft.OpenJDK.21
echo   illa:  https://adoptium.net  ->  "Install Temurin 21 (JDK)"
echo.
echo   Install pannina pinne indha file-a thirumba double-click pannunga.
echo  ------------------------------------------------------------
pause
exit /b 1

:havejava
echo  Starting the Java server...
start "" http://localhost:8080
java Server.java
echo.
echo  Server ninnuduchu (server stopped). Idha close pannalam.
pause
