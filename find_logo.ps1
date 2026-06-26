$lines = [System.IO.File]::ReadAllLines("c:\Users\praty\OneDrive\Desktop\awebai\awebai - Copy\index.html", [System.Text.Encoding]::UTF8)
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "logo|img") {
        Write-Output (($i+1).ToString() + ": " + $lines[$i].Trim())
    }
}
