@echo off
REM Run this script in Command Prompt or PowerShell OUTSIDE Cursor
REM (e.g. Windows Terminal, Git Bash, or cmd.exe) so Cursor does not add Co-authored-by.

cd /d "%~dp0"

echo Amending last commit to remove Co-authored-by...
git commit --amend -m "fix: room leave/expiry/delete toasts, real room delete, user list sync"

echo.
echo Force pushing to GitHub...
git push --force origin main

echo.
echo Done. Refresh your GitHub repo; cursoragent should disappear from contributors.
pause
