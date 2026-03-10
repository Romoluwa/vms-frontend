param(
  [string]$Url = "http://localhost:3000"
)

$chromePaths = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

$edgePaths = @(
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

$browserPath = $null

foreach ($path in $chromePaths) {
  if (Test-Path $path) {
    $browserPath = $path
    break
  }
}

if (-not $browserPath) {
  foreach ($path in $edgePaths) {
    if (Test-Path $path) {
      $browserPath = $path
      break
    }
  }
}

if (-not $browserPath) {
  Write-Error "No supported browser found. Install Chrome or Edge."
  exit 1
}

$args = @(
  "--kiosk",
  $Url,
  "--disable-pinch",
  "--overscroll-history-navigation=0"
)

Start-Process -FilePath $browserPath -ArgumentList $args
Write-Host "Kiosk started at $Url"
Write-Host "Exit with Alt+F4"
