@echo off
title Janani Diagnostic Center - Clinical LIMS Desktop Software
echo ==============================================================================
echo        JANANI DIAGNOSTIC CENTER - CLINICAL LABORATORY MANAGEMENT
echo                      Amin Tower, Trunk Road, Feni
echo ==============================================================================
echo Starting Janani LIMS Desktop Application...
echo.

set APP_URL=https://ais-dev-7hmqoz5ejvjobjtgtljggp-100525180701.asia-east1.run.app

:: Check if Microsoft Edge is available to launch in clean app mode (no address bar)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --start-maximized --window-size=1400,900
    exit /b
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="%APP_URL%" --start-maximized --window-size=1400,900
    exit /b
)

:: Check if Google Chrome is available
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%APP_URL%" --start-maximized --window-size=1400,900
    exit /b
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%APP_URL%" --start-maximized --window-size=1400,900
    exit /b
)

:: Fallback to default browser
start "" "%APP_URL%"
exit /b
