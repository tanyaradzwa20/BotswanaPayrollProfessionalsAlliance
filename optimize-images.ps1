# Image Optimization Script for BPPA Website
# Converts images to WebP format for better compression and performance

Write-Host "=== BPPA Image Optimization ===" -ForegroundColor Cyan
Write-Host ""

# Check if .NET Image classes are available
Add-Type -AssemblyName System.Drawing

# Function to convert and resize image to WebP (using PowerShell's .NET capabilities)
# Note: Native WebP support requires external tools. This script will prepare images for optimization.

# Create optimized images directory structure
$baseDir = "c:\Users\DELL\Desktop\bppa-website\assets\img"
$optimizedDir = "$baseDir\optimized"

# Create directories
New-Item -ItemType Directory -Force -Path "$optimizedDir\Home" | Out-Null
New-Item -ItemType Directory -Force -Path "$optimizedDir\membership" | Out-Null

Write-Host "Optimization directories created" -ForegroundColor Green
Write-Host ""
Write-Host "Image optimization recommendations:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Logo (logo.PNG)" -ForegroundColor White
Write-Host "   Current: 545x231, Display: 212x90"
Write-Host "   Recommended: Resize to 424x180 (2x for retina)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Home/home.png" -ForegroundColor White
Write-Host "   Current: Large background image"
Write-Host "   Recommended: Compress and convert to WebP" -ForegroundColor Gray
Write-Host ""
Write-Host "3. membership/trainee-membership.jpg" -ForegroundColor White
Write-Host "   Current: 1155x739, Display: 312x208"
Write-Host "   Recommended: Resize to 624x416 (2x for retina)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. membership/professional-membership.jpg" -ForegroundColor White
Write-Host "   Current: 802x514, Display: 460x200"
Write-Host "   Recommended: Resize to 920x400 (2x for retina)" -ForegroundColor Gray
Write-Host ""
Write-Host "5. membership/benefits.jpg" -ForegroundColor White
Write-Host "   Current: 480x308, Display: 312x294"
Write-Host "   Recommended: Resize to 624x588 (2x for retina)" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Home/slide3.jpg" -ForegroundColor White
Write-Host "   Current: Large slide image"
Write-Host "   Recommended: Compress and convert to WebP" -ForegroundColor Gray
Write-Host ""

# Function to resize image using .NET
function Resize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height,
        [int]$Quality = 85
    )
    
    try {
        $img = [System.Drawing.Image]::FromFile($InputPath)
        $newImg = New-Object System.Drawing.Bitmap($Width, $Height)
        $graphics = [System.Drawing.Graphics]::FromImage($newImg)
        
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        $graphics.DrawImage($img, 0, 0, $Width, $Height)
        
        # Get encoder for JPEG
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        
        $newImg.Save($OutputPath, $encoder, $encoderParams)
        
        $graphics.Dispose()
        $newImg.Dispose()
        $img.Dispose()
        
        return $true
    }
    catch {
        Write-Host "Error processing $InputPath : $_" -ForegroundColor Red
        return $false
    }
}

Write-Host "Processing images..." -ForegroundColor Cyan
Write-Host ""

# Optimize logo
if (Test-Path "$baseDir\logo.PNG") {
    Write-Host "Optimizing logo.PNG..." -ForegroundColor Yellow
    Resize-Image -InputPath "$baseDir\logo.PNG" -OutputPath "$optimizedDir\logo-optimized.jpg" -Width 424 -Height 180 -Quality 90
    Write-Host "  Created: logo-optimized.jpg (424x180)" -ForegroundColor Green
}

# Optimize membership images
if (Test-Path "$baseDir\membership\trainee-membership.jpg") {
    Write-Host "Optimizing trainee-membership.jpg..." -ForegroundColor Yellow
    Resize-Image -InputPath "$baseDir\membership\trainee-membership.jpg" -OutputPath "$optimizedDir\membership\trainee-membership-optimized.jpg" -Width 624 -Height 416 -Quality 85
    Write-Host "  Created: membership/trainee-membership-optimized.jpg (624x416)" -ForegroundColor Green
}

if (Test-Path "$baseDir\membership\professional-membership.jpg") {
    Write-Host "Optimizing professional-membership.jpg..." -ForegroundColor Yellow
    Resize-Image -InputPath "$baseDir\membership\professional-membership.jpg" -OutputPath "$optimizedDir\membership\professional-membership-optimized.jpg" -Width 920 -Height 400 -Quality 85
    Write-Host "  Created: membership/professional-membership-optimized.jpg (920x400)" -ForegroundColor Green
}

if (Test-Path "$baseDir\membership\benefits.jpg") {
    Write-Host "Optimizing benefits.jpg..." -ForegroundColor Yellow
    Resize-Image -InputPath "$baseDir\membership\benefits.jpg" -OutputPath "$optimizedDir\membership\benefits-optimized.jpg" -Width 624 -Height 588 -Quality 85
    Write-Host "  Created: membership/benefits-optimized.jpg (624x588)" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Optimization Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. For WebP conversion, use online tools:" -ForegroundColor White
Write-Host "   - https://cloudconvert.com/jpg-to-webp" -ForegroundColor Gray
Write-Host "   - https://squoosh.app/" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Or install ImageMagick/cwebp for batch conversion" -ForegroundColor White
Write-Host ""
Write-Host "Optimized images saved to: $optimizedDir" -ForegroundColor Yellow
