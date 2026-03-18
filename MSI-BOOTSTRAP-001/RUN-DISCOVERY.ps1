# RUN-DISCOVERY.ps1
# Honey Badger -- MSI Host Discovery Wrapper
# Run this script first. It discovers the MSI host hardware, OS, and network details.

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  MSI-BOOTSTRAP-001 -- Host Discovery" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verify the discovery script exists in the same folder
$scriptDir = $PSScriptRoot
$discoveryScript = Join-Path $scriptDir "detect_msi_host.ps1"

if (-not (Test-Path $discoveryScript)) {
    Write-Host "ERROR: detect_msi_host.ps1 not found in:" -ForegroundColor Red
    Write-Host "  $scriptDir" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure all package files are in the same folder." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found: detect_msi_host.ps1" -ForegroundColor Green
Write-Host "Running discovery..." -ForegroundColor Cyan
Write-Host ""

# Output goes to the package folder
$outputFile = Join-Path $scriptDir "msi-host-discovery-output.yaml"

try {
    & $discoveryScript -OutputPath $outputFile

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  DISCOVERY COMPLETE" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Output file: $outputFile" -ForegroundColor White
    Write-Host ""
    Write-Host "Next step: Review the output, then run RUN-STORAGE-VERIFY.ps1" -ForegroundColor Yellow
    Write-Host "  (after setting the share path placeholders in that script)" -ForegroundColor Yellow
}
catch {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "  DISCOVERY FAILED" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running PowerShell as Administrator if permissions are an issue." -ForegroundColor Yellow
    exit 1
}
