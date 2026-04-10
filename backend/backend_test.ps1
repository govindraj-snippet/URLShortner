$baseUrl = "http://localhost:8080/api/auth/public"
$username = "testuser_" + (Get-Random)
$email = "test_" + (Get-Random) + "@example.com"
$password = "password123"

Write-Host "Testing Registration..."
$registerBody = @{
    username = $username
    email = $email
    password = $password
    role = @("user")
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "Registration Successful: $regResponse" -ForegroundColor Green
} catch {
    Write-Host "Registration Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Details: $($reader.ReadToEnd())" -ForegroundColor Red
    }
}

Write-Host "`nTesting Login..."
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "Login Successful. Token received." -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token)" -ForegroundColor Yellow
} catch {
    Write-Host "Login Failed: $($_.Exception.Message)" -ForegroundColor Red
     if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Details: $($reader.ReadToEnd())" -ForegroundColor Red
    }
}
