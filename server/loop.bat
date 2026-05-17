@echo off
:loop
    node server.js
    timeout /t 5
goto loop