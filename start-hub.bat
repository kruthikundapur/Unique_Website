@echo off
setlocal enableextensions enabledelayedexpansion

REM Change to the directory of this script
pushd %~dp0

REM Move into the inner project folder
cd UniqWeb

REM Ensure .env exists
if not exist .env (
  echo OPENAI_API_KEY=your_openai_api_key_here> .env
)

echo.
echo Opening .env in Notepad. Paste your real key after OPENAI_API_KEY= and save.
start /wait notepad .env
echo.
echo If you edited and saved .env, press any key to continue...
pause >nul

REM Install dependencies only if node_modules missing
if not exist node_modules (
  echo Installing dependencies (first run)...
  call npm install
) else (
  echo Dependencies already installed.
)

echo Starting Social Impact Hub on http://127.0.0.1:5000 ...
call npm run dev

popd
endlocal

