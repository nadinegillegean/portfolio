param([string]$Root = $PSScriptRoot, [int]$Port = 8080)
$Root = [IO.Path]::GetFullPath($Root)
$types=@{".html"="text/html; charset=utf-8";".css"="text/css";".js"="text/javascript";".png"="image/png";".jpg"="image/jpeg";".jpeg"="image/jpeg";".webp"="image/webp";".svg"="image/svg+xml";".mp4"="video/mp4"}
$l=New-Object System.Net.HttpListener; $l.Prefixes.Add("http://localhost:$Port/"); $l.Start()
while($l.IsListening){ $c=$l.GetContext(); $p=[Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/')); if(!$p){$p="index.html"}
  $f=[IO.Path]::GetFullPath((Join-Path $Root $p))
  if($f.StartsWith($Root) -and (Test-Path $f -PathType Leaf)){ $b=[IO.File]::ReadAllBytes($f); $e=[IO.Path]::GetExtension($f).ToLower(); $c.Response.ContentType=$(if($types[$e]){$types[$e]}else{"application/octet-stream"}); $c.Response.OutputStream.Write($b,0,$b.Length) } else { $c.Response.StatusCode=404 }
  $c.Response.Close() }
