<?php

function responderOrcamento(int $status, string $mensagem, ?string $draftId = null): never
{
    http_response_code($status);
    $resposta = ['success' => $status < 400, 'message' => $mensagem];
    if ($draftId !== null) {
        $resposta['draft_id'] = $draftId;
    }

    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
    exit;
}

function permitirNovoRascunho(string $secret): bool
{
    $arquivo = sys_get_temp_dir() . '/daiane-orcamento-' . substr(hash('sha256', __DIR__), 0, 16) . '.json';
    $handle = fopen($arquivo, 'c+b');
    if ($handle === false) {
        throw new RuntimeException('Limite de orçamento indisponível.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Limite de orçamento indisponível.');
        }

        $conteudo = stream_get_contents($handle);
        $estado = $conteudo === '' ? [] : json_decode($conteudo, true, 16, JSON_THROW_ON_ERROR);
        $agora = time();
        $estado = array_filter($estado, static fn (array $item): bool => $item['ate'] > $agora);
        $ip = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? '', $secret);
        $estado[$ip] ??= ['ate' => $agora + 600, 'total' => 0];

        if ($estado[$ip]['total'] >= 8 || count($estado) > 10000) {
            return false;
        }

        $estado[$ip]['total']++;
        $json = json_encode($estado, JSON_THROW_ON_ERROR);
        if (!rewind($handle) || !ftruncate($handle, 0)
            || fwrite($handle, $json) !== strlen($json) || !fflush($handle)) {
            throw new RuntimeException('Falha ao registrar limite de orçamento.');
        }

        return true;
    } finally {
        fclose($handle);
    }
}

function validarNovoRascunho(string $token): void
{
    $secret = getenv('TURNSTILE_SECRET_KEY');
    if (!$secret || !getenv('TURNSTILE_SITE_KEY')) {
        responderOrcamento(503, 'A proteção do orçamento está indisponível. Tente novamente mais tarde.');
    }
    if ($token === '' || strlen($token) > 2048) {
        responderOrcamento(403, 'Conclua a verificação de segurança e tente novamente.');
    }
    if (!permitirNovoRascunho($secret)) {
        header('Retry-After: 600');
        responderOrcamento(429, 'Muitas tentativas de iniciar um orçamento. Aguarde alguns minutos.');
    }

    $contexto = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\nAccept: application/json",
        'content' => http_build_query(['secret' => $secret, 'response' => $token]),
        'timeout' => 8,
        'follow_location' => 0,
    ]]);

    $resposta = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $contexto);
    if ($resposta === false) {
        responderOrcamento(503, 'A verificação de segurança está indisponível. Tente novamente.');
    }

    $dados = json_decode($resposta, true);
    if (($dados['success'] ?? false) !== true || ($dados['action'] ?? '') !== 'orcamento'
        || !in_array($dados['hostname'] ?? '', ['daianedesigner.com.br', 'www.daianedesigner.com.br'], true)) {
        responderOrcamento(403, 'Conclua a verificação de segurança e tente novamente.');
    }
}

function finalizarEtapaOrcamento(array &$rascunho, string $etapa, string $mensagem, array $emailConfig, string $assunto, string $corpo): never
{
    if (empty($rascunho['avisos'][$etapa])) {
        enviarEmail($emailConfig, $assunto, $corpo);
        $rascunho['avisos'][$etapa] = true;
    }

    responderOrcamento(200, $mensagem, $rascunho['id']);
}
