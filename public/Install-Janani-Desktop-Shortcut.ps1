# Janani Diagnostic Center - Desktop Software Installer
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
