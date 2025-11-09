# PowerShell Script to Push and Deploy
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OMBALAJI Infra - Push to GitHub" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git remote exists
$remoteExists = git remote -v 2>&1
if ($LASTEXITCODE -ne 0 -or $remoteExists -eq "") {
    Write-Host "⚠️  GitHub repository not connected!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please provide your GitHub repository URL:" -ForegroundColor White
    Write-Host "Example: https://github.com/username/ombalaji-infra-website.git" -ForegroundColor Cyan
    Write-Host ""
    $repoUrl = Read-Host "Enter GitHub repository URL"
    
    if ($repoUrl) {
        Write-Host "Connecting to GitHub..." -ForegroundColor Yellow
        git remote add origin $repoUrl
        git branch -M main
        Write-Host "✅ Connected to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "❌ No repository URL provided. Exiting." -ForegroundColor Red
        exit
    }
} else {
    Write-Host "✅ GitHub repository is connected" -ForegroundColor Green
    Write-Host $remoteExists -ForegroundColor Gray
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Vercel will automatically redeploy if connected to GitHub" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Wait 2-3 minutes for Vercel to redeploy" -ForegroundColor Cyan
    Write-Host "2. Check your Vercel dashboard" -ForegroundColor Cyan
    Write-Host "3. Test your website URL" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OR manually redeploy:" -ForegroundColor Yellow
    Write-Host "- Go to: https://vercel.com/dashboard" -ForegroundColor Cyan
    Write-Host "- Click your project → Deployments → Redeploy" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Error pushing to GitHub" -ForegroundColor Red
    Write-Host "Please check your GitHub credentials and repository URL" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

