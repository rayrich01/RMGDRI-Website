============================================================
  MSI-BOOTSTRAP-001 -- Honey Badger Host Discovery Package
============================================================

PURPOSE
-------
This package performs MSI host discovery and shared-storage
verification ONLY. It does NOT execute any Honey Badger
scenarios. No workloads, no scenario runs -- discovery only.

TRANSFER INSTRUCTIONS
---------------------
1. Copy this ENTIRE folder to the MSI host at:
   C:\Users\irayr\Downloads\MSI-BOOTSTRAP-001\

   All files must stay in the same folder together.

STEP 1 -- HOST DISCOVERY
------------------------
1. Open PowerShell on the MSI host
2. Navigate to the package folder:
   cd C:\Users\irayr\Downloads\MSI-BOOTSTRAP-001\
3. Run:
   powershell -ExecutionPolicy Bypass -File .\RUN-DISCOVERY.ps1
4. Review the output on screen
5. The results are saved to:
   msi-host-discovery-output.yaml

STEP 2 -- SHARED STORAGE VERIFICATION
-------------------------------------
After discovery is complete and you know the SMB share path:

1. Open RUN-STORAGE-VERIFY.ps1 in a text editor (Notepad)
2. Set the two placeholder variables near the top:
   $SharePath = "\\YOUR-SERVER\YOUR-SHARE"
   $RunPath   = "\\YOUR-SERVER\YOUR-SHARE\runs"
3. Save the file
4. Run:
   powershell -ExecutionPolicy Bypass -File .\RUN-STORAGE-VERIFY.ps1
5. Review the output on screen
6. The results are saved to:
   shared-storage-verification-output.yaml

BRING BACK THESE FILES
-----------------------
After both steps are done, copy these two files back:

  * msi-host-discovery-output.yaml
  * shared-storage-verification-output.yaml

These are the evidence artifacts needed for Honey Badger
governance records.

IMPORTANT NOTES
---------------
- This package is SELF-CONTAINED. It does not depend on
  any paths outside this folder.
- This package does NOT perform Honey Badger scenario
  execution. It is strictly for discovery and verification.
- If anything fails, read the error messages on screen.
  They will tell you what went wrong.

============================================================
