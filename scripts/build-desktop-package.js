import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

console.log('Generating Desktop Software Distribution Files...');

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Windows 1-Click Desktop Launcher Script (BAT)
const windowsLauncherContent = `@echo off
title Janani Diagnostic Center - Clinical LIMS Desktop Software
echo ==============================================================================
echo        JANANI DIAGNOSTIC CENTER - CLINICAL LABORATORY MANAGEMENT
echo                      Amin Tower, Trunk Road, Feni
echo ==============================================================================
echo Starting Janani LIMS Desktop Application...
echo.

set APP_URL=https://ais-dev-7hmqoz5ejvjobjtgtljggp-100525180701.asia-east1.run.app

:: Check if Microsoft Edge is available to launch in clean app mode (no address bar)
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%APP_URL%" --start-maximized --window-size=1400,900
    exit /b
)
if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%APP_URL%" --start-maximized --window-size=1400,900
    exit /b
)

:: Check if Google Chrome is available
if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --app="%APP_URL%" --start-maximized --window-size=1400,900
    exit /b
)
if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" --app="%APP_URL%" --start-maximized --window-size=1400,900
    exit /b
)

:: Fallback to default browser
start "" "%APP_URL%"
exit /b
`;

fs.writeFileSync(path.join(publicDir, 'Launch-Janani-Desktop.bat'), windowsLauncherContent, 'utf-8');
console.log('Created public/Launch-Janani-Desktop.bat');

// 2. Windows VBS Silent Launcher (No black CMD box, launches native app window)
const vbsLauncherContent = `' Janani Diagnostic Center Desktop Application Silent Launcher
Set WshShell = CreateObject("WScript.Shell")
strURL = "https://ais-dev-7hmqoz5ejvjobjtgtljggp-100525180701.asia-east1.run.app"

' Try Edge App Mode first
On Error Resume Next
WshShell.Run "msedge.exe --app=" & strURL & " --start-maximized", 1, False
If Err.Number <> 0 Then
    Err.Clear
    WshShell.Run "chrome.exe --app=" & strURL & " --start-maximized", 1, False
    If Err.Number <> 0 Then
        Err.Clear
        WshShell.Run strURL, 1, False
    End If
End If
`;

fs.writeFileSync(path.join(publicDir, 'Janani-Desktop-App.vbs'), vbsLauncherContent, 'utf-8');
console.log('Created public/Janani-Desktop-App.vbs');

// 3. Desktop Installer / Setup Powershell Script (.ps1)
const ps1SetupContent = `# Janani Diagnostic Center - Desktop Software Installer
$appName = "Janani Diagnostic Center"
$appUrl = "https://ais-dev-7hmqoz5ejvjobjtgtljggp-100525180701.asia-east1.run.app"
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "$appName.lnk"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Installing Janani Diagnostic Center Desktop App..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = "msedge.exe"
$Shortcut.Arguments = "--app=$appUrl --start-maximized"
$Shortcut.Description = "Janani Diagnostic Center Clinical Laboratory System"
$Shortcut.Save()

Write-Host "✓ Desktop Shortcut created successfully on your desktop!" -ForegroundColor Green
Write-Host "You can now launch Janani LIMS directly from your desktop." -ForegroundColor Yellow
`;

fs.writeFileSync(path.join(publicDir, 'Install-Janani-Desktop-Shortcut.ps1'), ps1SetupContent, 'utf-8');
console.log('Created public/Install-Janani-Desktop-Shortcut.ps1');

// 4. Create Desktop Distribution Package ZIP
async function createDesktopZip() {
  const zip = new JSZip();
  zip.file('Launch-Janani-Desktop.bat', windowsLauncherContent);
  zip.file('Janani-Desktop-App.vbs', vbsLauncherContent);
  zip.file('Install-Janani-Desktop-Shortcut.ps1', ps1SetupContent);
  zip.file('README-DESKTOP-SETUP.txt', `JANANI DIAGNOSTIC CENTER - DESKTOP SOFTWARE SETUP
=============================================================
Location: Amin Tower, Trunk Road, Feni
Hotline: 01711-307064, 01715-081014

HOW TO RUN THE DESKTOP SOFTWARE:
1. Double-click "Launch-Janani-Desktop.bat" to start the desktop app immediately in native standalone window mode.
2. Or run "Install-Janani-Desktop-Shortcut.ps1" in PowerShell to add an icon to your Windows Desktop.
3. Or in Microsoft Edge / Google Chrome, click the "Install" icon in the address bar to install as a native Desktop App.

FEATURES INCLUDED:
- Clean Medical Typography (Inter + JetBrains Mono)
- Official Logo with DGHS Accreditation & 24/7 Hotline
- Live Active QR Code Public Verification Portal
- 3-Verifier Authorization (2 Medical Technologists + 1 Doctor)
- Dynamic Print Layouts (A4, A5, Letter, Legal, B5, Custom Dimensions)
- Zero Duplicate Phone Numbers or Barcodes
- Offline Data Persistence & Diagnostic Reporting
`);

  // Add logo asset if exists
  const logoPath = path.join(publicDir, 'fj.png');
  if (fs.existsSync(logoPath)) {
    zip.file('fj.png', fs.readFileSync(logoPath));
  }

  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(publicDir, 'Janani-Diagnostic-Center-Desktop-Software.zip'), content);
  console.log('Created public/Janani-Diagnostic-Center-Desktop-Software.zip');
}

createDesktopZip();
