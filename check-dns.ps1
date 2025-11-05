# PowerShell script to check DNS records for mirqabtutorial.com
# Run this script to verify DNS configuration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DNS Configuration Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check www subdomain (should be CNAME)
Write-Host "Checking www.mirqabtutorial.com (should be CNAME):" -ForegroundColor Yellow
try {
    $wwwResult = Resolve-DnsName -Name "www.mirqabtutorial.com" -Type CNAME -ErrorAction Stop
    Write-Host "✓ CNAME found:" -ForegroundColor Green
    foreach ($record in $wwwResult) {
        Write-Host "  Name: $($record.NameHost)" -ForegroundColor White
        if ($record.NameHost -eq "adelalawneh77-cpu.github.io") {
            Write-Host "  ✓ Correct! Points to GitHub Pages" -ForegroundColor Green
        } else {
            Write-Host "  ✗ Wrong! Should point to: adelalawneh77-cpu.github.io" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "✗ CNAME not found or incorrect!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Check apex domain (should be A records)
Write-Host "Checking mirqabtutorial.com (should be A records):" -ForegroundColor Yellow
try {
    $apexResult = Resolve-DnsName -Name "mirqabtutorial.com" -Type A -ErrorAction Stop
    Write-Host "✓ A records found:" -ForegroundColor Green
    
    $expectedIPs = @("185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153")
    $foundIPs = @()
    
    foreach ($record in $apexResult) {
        $ip = $record.IPAddress
        $foundIPs += $ip
        if ($expectedIPs -contains $ip) {
            Write-Host "  ✓ $ip - Correct!" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $ip - Unexpected IP!" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Expected IPs:" -ForegroundColor Yellow
    foreach ($expectedIP in $expectedIPs) {
        if ($foundIPs -contains $expectedIP) {
            Write-Host "  ✓ $expectedIP - Found" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $expectedIP - Missing!" -ForegroundColor Red
        }
    }
    
    if ($foundIPs.Count -lt 4) {
        Write-Host ""
        Write-Host "⚠ Warning: Only $($foundIPs.Count) A records found. Expected 4!" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ A records not found or incorrect!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Required DNS Records:" -ForegroundColor Yellow
Write-Host "1. CNAME: www → adelalawneh77-cpu.github.io" -ForegroundColor White
Write-Host "2. A: @ → 185.199.108.153" -ForegroundColor White
Write-Host "3. A: @ → 185.199.109.153" -ForegroundColor White
Write-Host "4. A: @ → 185.199.110.153" -ForegroundColor White
Write-Host "5. A: @ → 185.199.111.153" -ForegroundColor White
Write-Host ""
Write-Host "After fixing DNS, wait 10-15 minutes, then:" -ForegroundColor Yellow
Write-Host "1. Go to GitHub: Settings > Pages" -ForegroundColor White
Write-Host "2. Remove the custom domain (if exists)" -ForegroundColor White
Write-Host "3. Wait 5 minutes" -ForegroundColor White
Write-Host "4. Add www.mirqabtutorial.com again" -ForegroundColor White
Write-Host "5. Wait 10-15 minutes" -ForegroundColor White
Write-Host "6. Click 'Check again'" -ForegroundColor White
Write-Host ""

