$ErrorActionPreference = "Stop"

# Get all modified, deleted, and untracked files
$status = git status --porcelain
if (-not $status) { Write-Host "No changes to commit."; exit }

# Parse files, filter out empty lines if any
$files = $status | ForEach-Object { 
    $line = $_.Trim()
    if ($line.Length -gt 3) {
        $path = $line.Substring(3)
        # Handle quotes (files with spaces)
        $path = $path.Trim('"')
        $path
    }
} | Where-Object { $_ -ne $null -and $_ -ne "" }

$totalFiles = $files.Count
Write-Host "Found $totalFiles files to commit."

if ($totalFiles -eq 0) { exit }

# Date setup
$startDate = Get-Date -Date "2026-02-01"
$totalDays = 14
$filesPerDay = [math]::Ceiling($totalFiles / $totalDays)
if ($filesPerDay -lt 1) { $filesPerDay = 1 }

$currentIndex = 0

for ($day = 0; $day -lt $totalDays; $day++) {
    if ($currentIndex -ge $totalFiles) { break }

    $date = $startDate.AddDays($day)
    # Random time (9AM - 6PM)
    $hour = Get-Random -Minimum 9 -Maximum 18
    $minute = Get-Random -Minimum 0 -Maximum 59
    $date = $date.Date.AddHours($hour).AddMinutes($minute)
    $dateStr = $date.ToString("yyyy-MM-dd HH:mm:ss")
    
    # Get the chunk of files for this day
    $endIndex = [math]::Min($currentIndex + $filesPerDay - 1, $totalFiles - 1)
    
    Write-Host "Day $($day+1): Committing files $($currentIndex+1) to $($endIndex+1) on $dateStr"
    
    # Add files one by one for this batch
    for ($i = $currentIndex; $i -le $endIndex; $i++) {
        $f = $files[$i]
        Write-Host "  Adding: $f"
        git add "$f"
    }
    
    # Set env vars for backdating
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    
    # Commit
    try {
        git commit -m "Update project structure and components" --date="$dateStr" | Out-Null
    }
    catch {
        Write-Warning "Commit possibly empty, continuing..."
    }
    
    $currentIndex = $endIndex + 1
}

# Cleanup Env Vars
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

# Push
Write-Host "Pushing to remote..."
git push origin main
