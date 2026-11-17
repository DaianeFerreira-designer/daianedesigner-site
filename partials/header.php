<?php
// A home é a fonte única da estrutura dos menus.
$homeHtml = $homeHtml ?? file_get_contents(__DIR__ . '/../index.html');
preg_match_all('/<header\b[^>]*>[\s\S]*?<\/header>/', $homeHtml, $menus);
$headerHtml = implode("\n", $menus[0]);
$headerHtml = str_replace('href="#', 'href="/#', $headerHtml);
$headerHtml = preg_replace(
    '/(<a\b[^>]*href="\/orcamento"[^>]*)(>)/',
    '$1 aria-current="page"$2',
    $headerHtml
);
echo $headerHtml;
?>
