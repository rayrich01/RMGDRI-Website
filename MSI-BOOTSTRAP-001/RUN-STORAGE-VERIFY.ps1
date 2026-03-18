# RUN-STORAGE-VERIFY.ps1
# Honey Badger -- Shared Storage Verification Wrapper
# Run this AFTER RUN-DISCOVERY.ps1 and after you know the share details.

# ============================================================
# OPERATOR: Set these two variables before running this script.
# Replace the empty strings with your actual share paths.
# Example:
#   $SharePath = "\\MACMINI\HoneyBadger"
#   $RunPath   = "\\MACMINI\HoneyBadger\runs"
# ============================================================
$SharePath = ""
$RunPath   = ""
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  MSI-BOOTSTRAP-001 -- Storage Verification" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if placeholders are still empty
if (-not $SharePath) {
    Write-Host "NOTICE: Share path is not set yet." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Before running this script, open it in a text editor" -ForegroundColor White
    Write-Host "and set the `$SharePath and `$RunPath variables near the top." -ForegroundColor White
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Gray
    Write-Host '  $SharePath = "\\MACMINI\HoneyBadger"' -ForegroundColor Gray
    Write-Host '  $RunPath   = "\\MACMINI\HoneyBadger\runs"' -ForegroundColor Gray
    Write-Host ""
    Write-Host "No error -- just set the paths and re-run." -ForegroundColor Yellow
    exit 0
}

# Verify the verification script exists in the same folder
$scriptDir = $PSScriptRoot
$verifyScript = Join-Path $scriptDir "verify_shared_storage.ps1"

if (-not (Test-Path $verifyScript)) {
    Write-Host "ERROR: verify_shared_storage.ps1 not found in:" -ForegroundColor Red
    Write-Host "  $scriptDir" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure all package files are in the same folder." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found: verify_shared_storage.ps1" -ForegroundColor Green
Write-Host "Share Path : $SharePath" -ForegroundColor White
Write-Host "Run Path   : $RunPath" -ForegroundColor White
Write-Host ""
Write-Host "Running verification..." -ForegroundColor Cyan
Write-Host ""

# Output goes to the package folder
$outputFile = Join-Path $scriptDir "shared-storage-verification-output.yaml"

try {
    & $verifyScript -SharePath $SharePath -RunPath $RunPath -OutputPath $outputFile

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  STORAGE VERIFICATION COMPLETE" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Output file: $outputFile" -ForegroundColor White
    Write-Host ""
    Write-Host "Bring back these two files:" -ForegroundColor Yellow
    Write-Host "  - msi-host-discovery-output.yaml" -ForegroundColor White
    Write-Host "  - shared-storage-verification-output.yaml" -ForegroundColor White
}
catch {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "  STORAGE VERIFICATION FAILED" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check that the share path is correct and accessible." -ForegroundColor Yellow
    exit 1
}
