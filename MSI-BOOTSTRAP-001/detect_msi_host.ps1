# detect_msi_host.ps1
# Honey Badger -- MSI Host Discovery Script
# Detects hardware, OS, network, and identity details for the MSI target host.

param(
    [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"

if (-not $OutputPath) {
    $OutputPath = Join-Path $PSScriptRoot "msi-host-discovery-output.yaml"
}

Write-Host "=== MSI Host Discovery ===" -ForegroundColor Cyan
Write-Host "Output target: $OutputPath"
Write-Host ""

try {
    $cs = Get-CimInstance Win32_ComputerSystem
    $os = Get-CimInstance Win32_OperatingSystem
    $bios = Get-CimInstance Win32_BIOS
    $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
    $disk = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3"
    $net = Get-CimInstance Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled -eq $true }

    $totalDiskGB = ($disk | Measure-Object -Property Size -Sum).Sum / 1GB
    $freeDiskGB  = ($disk | Measure-Object -Property FreeSpace -Sum).Sum / 1GB

    $netEntries = @()
    foreach ($adapter in $net) {
        $entry = "    - adapter: `"$($adapter.Description)`""
        if ($adapter.IPAddress) {
            $entry += "`n      ip_addresses:"
            foreach ($ip in $adapter.IPAddress) {
                $entry += "`n        - `"$ip`""
            }
        }
        if ($adapter.MACAddress) {
            $entry += "`n      mac: `"$($adapter.MACAddress)`""
        }
        $netEntries += $entry
    }
    $netBlock = $netEntries -join "`n"

    $driveEntries = @()
    foreach ($d in $disk) {
        $sizeGB = [math]::Round($d.Size / 1GB, 2)
        $freeGB = [math]::Round($d.FreeSpace / 1GB, 2)
        $driveEntries += "    - drive: `"$($d.DeviceID)`"`n      size_gb: $sizeGB`n      free_gb: $freeGB"
    }
    $driveBlock = $driveEntries -join "`n"

    $timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")

    $yaml = @"
# MSI Host Discovery Output
# Generated: $timestamp
# Script: detect_msi_host.ps1

msi_host_discovery:
  timestamp: "$timestamp"
  host_id: "MSI-HARNESS-001"

  identity:
    hostname: "$($cs.Name)"
    domain: "$($cs.Domain)"
    current_user: "$($env:USERNAME)"
    computer_model: "$($cs.Model)"
    manufacturer: "$($cs.Manufacturer)"

  operating_system:
    caption: "$($os.Caption)"
    version: "$($os.Version)"
    build: "$($os.BuildNumber)"
    architecture: "$($os.OSArchitecture)"
    install_date: "$($os.InstallDate)"

  hardware:
    cpu:
      name: "$($cpu.Name)"
      cores: $($cpu.NumberOfCores)
      logical_processors: $($cpu.NumberOfLogicalProcessors)
      max_clock_mhz: $($cpu.MaxClockSpeed)
    memory:
      total_gb: $([math]::Round($cs.TotalPhysicalMemory / 1GB, 2))
    bios:
      serial: "$($bios.SerialNumber)"
      version: "$($bios.SMBIOSBIOSVersion)"

  storage:
    total_disk_gb: $([math]::Round($totalDiskGB, 2))
    free_disk_gb: $([math]::Round($freeDiskGB, 2))
    drives:
$driveBlock

  network:
    adapters:
$netBlock

  powershell:
    version: "$($PSVersionTable.PSVersion)"
    edition: "$($PSVersionTable.PSEdition)"

  status: "discovery_complete"
"@

    $yaml | Out-File -FilePath $OutputPath -Encoding UTF8
    Write-Host ""
    Write-Host "Discovery complete." -ForegroundColor Green
    Write-Host "Output written to: $OutputPath"
}
catch {
    Write-Host "ERROR: Discovery failed." -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
