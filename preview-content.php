<?php

declare(strict_types=1);

/*
 * Gateway do preview.
 * Ele não baixa, não reescreve e não modifica o site.
 * Apenas valida o projeto solicitado e redireciona o iframe
 * para a URL original cadastrada.
 */

$projects = [
    'mentoria' =>
        'https://portfolio.daianeferreira.com.br/mentoria/',

    'lumio' =>
        'https://portfolio.daianeferreira.com.br/lumio/',

    'nutricao-executiva' =>
        'https://portfolio.daianeferreira.com.br/bio-nutricao-executiva/',

    'trafego-turbo' =>
        'https://portfolio.daianeferreira.com.br/trafegoturbo/',
];

$project = isset($_GET['project'])
    ? trim((string) $_GET['project'])
    : '';

if (!isset($projects[$project])) {
    http_response_code(404);

    header('Content-Type: text/plain; charset=UTF-8');
    header('Cache-Control: no-store');

    exit('Preview não encontrado.');
}

header(
    'Cache-Control: no-store, no-cache, must-revalidate, max-age=0'
);

header('Pragma: no-cache');

header(
    'X-Robots-Tag: noindex, nofollow, noarchive'
);

header(
    'X-Content-Type-Options: nosniff'
);

header(
    'Location: ' . $projects[$project],
    true,
    302
);

exit;