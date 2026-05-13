@echo off
:loop
    node server.js
    timeout /t 15
goto loop