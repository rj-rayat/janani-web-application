' Janani Diagnostic Center Desktop Application Silent Launcher
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
