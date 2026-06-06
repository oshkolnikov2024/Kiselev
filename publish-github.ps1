# Публикация лендинга ДВА на GitHub Pages
$ErrorActionPreference = "Stop"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Set-Location $PSScriptRoot

gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Сначала войдите в GitHub (откроется браузер)..." -ForegroundColor Yellow
    gh auth login --hostname github.com --git-protocol https --web
}

$user = (gh api user -q .login)
$repo = "dva-landing"
Write-Host "Аккаунт: $user  Репозиторий: $repo"

gh repo view "$user/$repo" 2>$null
if ($LASTEXITCODE -ne 0) {
    gh repo create $repo --public --source=. --remote=origin --push --description "Лендинг Дмитрий — рыбный мастер"
} else {
    git push -u origin master 2>$null
    if ($LASTEXITCODE -ne 0) { git push -u origin main 2>$null }
    git push origin HEAD:master -f 2>$null
}

gh api -X POST "repos/$user/$repo/pages" -f build_type=legacy -f source[branch]=master -f source[path]="/" 2>$null
gh api -X PUT "repos/$user/$repo/pages" -f build_type=legacy -f source[branch]=master -f source[path]="/" 2>$null

Start-Sleep -Seconds 3
$url = "https://$user.github.io/$repo/"
Write-Host ""
Write-Host "Готово! Ссылка для просмотра:" -ForegroundColor Green
Write-Host $url
Write-Host "Репозиторий: https://github.com/$user/$repo" -ForegroundColor Cyan
Start-Process $url
