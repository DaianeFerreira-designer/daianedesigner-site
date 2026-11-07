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

function validarNovoRascunho(): void
{
    $secret = hash('sha256', __FILE__);
    if (!permitirNovoRascunho($secret)) {
        header('Retry-After: 600');
        responderOrcamento(429, 'Muitas tentativas de iniciar um orçamento. Aguarde alguns minutos.');
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
