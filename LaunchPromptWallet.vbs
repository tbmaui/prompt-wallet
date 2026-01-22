Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
' Get the folder where this script is located
CurrentDir = FSO.GetParentFolderName(WScript.ScriptFullName)
' Build the path to the batch file
BatchPath = FSO.BuildPath(CurrentDir, "launch_app.bat")
' Run it hidden (0)
WshShell.Run chr(34) & BatchPath & chr(34), 0
Set WshShell = Nothing
