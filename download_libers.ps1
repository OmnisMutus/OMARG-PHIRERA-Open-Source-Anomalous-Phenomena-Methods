$ErrorActionPreference = 'Stop'
$baseUrl = "https://thelema.tools/bot-books/aleister_crowley/libers/"
$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = Get-Location }
$targetDir = Join-Path $scriptDir "references\libers"
$bibFile = Join-Path $scriptDir "references\bibliography.md"

if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
}

Write-Host "Fetching directory listing from $baseUrl..."
$html = (Invoke-WebRequest -Uri $baseUrl -UseBasicParsing).Content

# Find all links that end in typical book extensions (e.g., pdf, epub, txt)
$matches = [regex]::Matches($html, 'href="([^"]+\.(pdf|epub|txt|docx?))"')
$files = @()

foreach ($m in $matches) {
    $filename = $m.Groups[1].Value
    if ($filename -match "^/") { continue } # skip absolute paths that might go outside the dir
    $files += $filename
}

$files = $files | Select-Object -Unique
Write-Host "Found $($files.Count) files to download."

$bibContent = @(
    "# Bibliography: Thelema Libers",
    "",
    "The following texts have been archived locally for safety and reference.",
    ""
)

foreach ($file in $files) {
    $fileUrl = "$baseUrl$file"
    $localPath = Join-Path $targetDir $file
    
    if (!(Test-Path $localPath)) {
        Write-Host "Downloading $file..."
        Invoke-WebRequest -Uri $fileUrl -OutFile $localPath -UseBasicParsing
    } else {
        Write-Host "File $file already exists, skipping download."
    }
    
    $bibContent += "- [$file](libers/$file)"
}

Write-Host "Writing bibliography to $bibFile..."
Set-Content -Path $bibFile -Value ($bibContent -join "`r`n")
Write-Host "Done!"
