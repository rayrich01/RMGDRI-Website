# verify_shared_storage.ps1
# Honey Badger -- Shared Storage Verification Script
# Verifies SMB/network share accessibility and write capability for the MSI host.

param(
    [string]$SharePath = "",
    [string]$RunPath = "",
    [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"

if (-not $OutputPath) {
    $OutputPath = Join-Path $PSScriptRoot "shared-storage-verification-output.yaml"
}

Write-Host "=== Shared Storage Verification ===" -ForegroundColor Cyan
Write-Host "Share Path : $SharePath"
Write-Host "Run Path   : $RunPath"
Write-Host "Output     : $OutputPath"
Write-Host ""

if (-not $SharePath) {
    Write-Host "ERROR: SharePath parameter is required." -ForegroundColor Red
    Write-Host "Usage: .\verify_shared_storage.ps1 -SharePath '\\server\share' -RunPath '\\server\share\runs'"
    exit 1
}

$timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")

$results = @{
    share_exists      = $false
    share_readable    = $false
    share_writable    = $false
    run_path_exists   = $false
    run_path_writable = $false
    smb_sessions      = @()
    errors            = @()
}

try {
    # Test share existence
    if (Test-Path $SharePath) {
        $results.share_exists = $true
        Write-Host "[PASS] Share path exists: $SharePath" -ForegroundColor Green

        # Test readability
        try {
            $items = Get-ChildItem $SharePath -ErrorAction Stop | Select-Object -First 5
            $results.share_readable = $true
            Write-Host "[PASS] Share is readable ($($items.Count) items listed)" -ForegroundColor Green
        }
        catch {
            $results.errors += "Share read failed: $($_.Exception.Message)"
            Write-Host "[FAIL] Share is not readable" -ForegroundColor Red
        }

        # Test writability
        $testFile = Join-Path $SharePath ".hb-write-test-$(Get-Random).tmp"
        try {
            "write-test" | Out-File -FilePath $testFile -Encoding UTF8 -ErrorAction Stop
            Remove-Item $testFile -Force -ErrorAction SilentlyContinue
            $results.share_writable = $true
            Write-Host "[PASS] Share is writable" -ForegroundColor Green
        }
        catch {
            $results.errors += "Share write failed: $($_.Exception.Message)"
            Write-Host "[FAIL] Share is not writable" -ForegroundColor Yellow
        }
    }
    else {
        $results.errors += "Share path not found: $SharePath"
        Write-Host "[FAIL] Share path does not exist: $SharePath" -ForegroundColor Red
    }

    # Test run path if provided
    if ($RunPath) {
        if (Test-Path $RunPath) {
            $results.run_path_exists = $true
            Write-Host "[PASS] Run path exists: $RunPath" -ForegroundColor Green

            $testFile2 = Join-Path $RunPath ".hb-write-test-$(Get-Random).tmp"
            try {
                "write-test" | Out-File -FilePath $testFile2 -Encoding UTF8 -ErrorAction Stop
                Remove-Item $testFile2 -Force -ErrorAction SilentlyContinue
                $results.run_path_writable = $true
                Write-Host "[PASS] Run path is writable" -ForegroundColor Green
            }
            catch {
                $results.errors += "Run path write failed: $($_.Exception.Message)"
                Write-Host "[FAIL] Run path is not writable" -ForegroundColor Yellow
            }
        }
        else {
            $results.errors += "Run path not found: $RunPath"
            Write-Host "[FAIL] Run path does not exist: $RunPath" -ForegroundColor Red
        }
    }

    # Enumerate SMB connections
    try {
        $smbSessions = Get-SmbConnection -ErrorAction SilentlyContinue
        if ($smbSessions) {
            foreach ($s in $smbSessions) {
                $results.smb_sessions += @{
                    server = $s.ServerName
                    share  = $s.ShareName
                }
            }
        }
    }
    catch {
        # Get-SmbConnection may not be available on all editions
    }
}
catch {
    $results.errors += "Unexpected error: $($_.Exception.Message)"
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Build YAML output
$errorBlock = ""
if ($results.errors.Count -gt 0) {
    $errorLines = $results.errors | ForEach-Object { "    - `"$_`"" }
    $errorBlock = $errorLines -join "`n"
}
else {
    $errorBlock = "    []"
}

$smbBlock = ""
if ($results.smb_sessions.Count -gt 0) {
    $smbLines = $results.smb_sessions | ForEach-Object { "    - server: `"$($_.server)`"`n      share: `"$($_.share)`"" }
    $smbBlock = $smbLines -join "`n"
}
else {
    $smbBlock = "    []"
}

$overallStatus = if ($results.share_exists -and $results.share_readable) { "verified" } else { "failed" }

$yaml = @"
# Shared Storage Verification Output
# Generated: $timestamp
# Script: verify_shared_storage.ps1

shared_storage_verification:
  timestamp: "$timestamp"
  host_id: "MSI-HARNESS-001"
  status: "$overallStatus"

  target:
    share_path: "$SharePath"
    run_path: "$RunPath"

  results:
    share_exists: $($results.share_exists.ToString().ToLower())
    share_readable: $($results.share_readable.ToString().ToLower())
    share_writable: $($results.share_writable.ToString().ToLower())
    run_path_exists: $($results.run_path_exists.ToString().ToLower())
    run_path_writable: $($results.run_path_writable.ToString().ToLower())

  smb_connections:
$smbBlock

  errors:
$errorBlock
"@

$yaml | Out-File -FilePath $OutputPath -Encoding UTF8
Write-Host ""
Write-Host "Verification complete. Status: $overallStatus" -ForegroundColor $(if ($overallStatus -eq "verified") { "Green" } else { "Red" })
Write-Host "Output written to: $OutputPath"
