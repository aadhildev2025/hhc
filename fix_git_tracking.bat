@echo off
echo ===================================================
echo 🛠️ HomeHeartCreation - Git Tracking Fixer
echo ===================================================
echo.
echo This script will help fix the "Permission Denied" error on Vercel.
echo It will tell Git to stop tracking the "node_modules" folders.
echo.
echo ⚠️ Your code will NOT be deleted. 
echo ⚠️ After this, you MUST open GitHub Desktop and Push the changes.
echo.
pause

echo.
echo ⏳ Step 1: Clearing Git cache...
git rm -r --cached .

echo.
echo ⏳ Step 2: Re-adding files (honoring .gitignore)...
git add .

echo.
echo ⏳ Step 3: Creating a cleanup commit...
git commit -m "FIX: Completely stop tracking node_modules"

echo.
echo ✅ Done! 
echo.
echo 🚀 NEXT STEPS:
echo 1. Open GitHub Desktop.
echo 2. You will see many "deleted" files in the node_modules folders.
echo 3. Click "Push origin" to send these removals to GitHub.
echo.
pause
