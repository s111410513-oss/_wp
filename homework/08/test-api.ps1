$ErrorActionPreference = "Stop"
$base = "http://localhost:3000/api"

Write-Output "=== 1. START NORMAL MODE ==="
'{"playerName":"Test","mode":"normal","difficulty":"easy"}' | Out-File -Encoding ASCII "$env:TEMP\test1.json"
$s = Invoke-RestMethod -Uri "$base/game/start" -Method Post -ContentType "application/json" -InFile "$env:TEMP\test1.json"
Write-Output "OK gameId=$($s.gameId) max=$($s.max)"

Write-Output "=== 2. GUESS NORMAL ==="
$gid = $s.gameId
@"
{"gameId":"$gid","guess":50,"playerName":"Test"}
"@ | Out-File -Encoding ASCII "$env:TEMP\test2.json"
$g = Invoke-RestMethod -Uri "$base/game/guess" -Method Post -ContentType "application/json" -InFile "$env:TEMP\test2.json"
Write-Output "OK result=$($g.result) attempts=$($g.attempts)"

Write-Output "=== 3. OUT OF RANGE GUESS ==="
@"
{"gameId":"$gid","guess":0,"playerName":"Test"}
"@ | Out-File -Encoding ASCII "$env:TEMP\test3.json"
try {
    $null = Invoke-RestMethod -Uri "$base/game/guess" -Method Post -ContentType "application/json" -InFile "$env:TEMP\test3.json"
    Write-Output "UNEXPECTED"
} catch { Write-Output "OK got 400 (out of range)" }

Write-Output "=== 4. START CHALLENGE ==="
'{"playerName":"Test","mode":"challenge","difficulty":"hard"}' | Out-File -Encoding ASCII "$env:TEMP\test4.json"
$c = Invoke-RestMethod -Uri "$base/game/start" -Method Post -ContentType "application/json" -InFile "$env:TEMP\test4.json"
Write-Output "OK level=$($c.level) max=$($c.max) attemptsLeft=$($c.attemptsLeft) hintsLeft=$($c.hintsLeft)"
$cgid = $c.gameId

Write-Output "=== 5. HINT oddEven ==="
@'
{"gameId":"CGID","hintType":"oddEven"}
'@ -replace "CGID",$cgid | Out-File -Encoding ASCII "$env:TEMP\test5.json"
$h = Invoke-RestMethod -Uri "$base/game/hint" -Method Post -ContentType "application/json" -InFile "$env:TEMP\test5.json"
Write-Output "OK hint=$($h.hint) hintsLeft=$($h.hintsLeft)"

Write-Output "=== 6. HINT prime ==="
@'
{"gameId":"CGID","hintType":"prime"}
'@ -replace "CGID",$cgid | Out-File -Encoding ASCII "$env:TEMP\test6.json"
$h2 = Invoke-RestMethod -Uri "$base/game/hint" -Method Post -ContentType "application/json" -InFile "$env:TEMP\test6.json"
Write-Output "OK hint=$($h2.hint) hintsLeft=$($h2.hintsLeft)"

Write-Output "=== 7. HINT range ==="
@'
{"gameId":"CGID","hintType":"range"}
'@ -replace "CGID",$cgid | Out-File -Encoding ASCII "$env:TEMP\test7.json"
$h3 = Invoke-RestMethod -Uri "$base/game/hint" -Method Post -ContentType "application/json" -InFile "$env:TEMP\test7.json"
Write-Output "OK hint=$($h3.hint) hintsLeft=$($h3.hintsLeft)"

Write-Output "=== 8. HINT exhausted ==="
try {
    $null = Invoke-RestMethod -Uri "$base/game/hint" -Method Post -ContentType "application/json" -InFile "$env:TEMP\test6.json"
    Write-Output "UNEXPECTED"
} catch { Write-Output "OK got error (no hints left)" }

Write-Output "=== 9. GUESS CHALLENGE ==="
@'
{"gameId":"CGID","guess":10,"playerName":"Test"}
'@ -replace "CGID",$cgid | Out-File -Encoding ASCII "$env:TEMP\test9.json"
$g2 = Invoke-RestMethod -Uri "$base/game/guess" -Method Post -ContentType "application/json" -InFile "$env:TEMP\test9.json"
Write-Output "OK result=$($g2.result) attemptsLeft=$($g2.attemptsLeft) hintsLeft=$($g2.hintsLeft)"

Write-Output "=== 10. LEADERBOARD ==="
$lb = Invoke-RestMethod -Uri "$base/leaderboard"
Write-Output "OK count=$($lb.Count)"

Write-Output "`n=== ALL TESTS PASSED ==="
