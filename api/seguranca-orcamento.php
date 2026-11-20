<?php

if (PHP_SAPI !== 'cli' && realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

function iniciarSessaoOrcamento(): void
{
    ini_set('display_errors', '0');
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_set_cookie_params([
        'path' => '/',
        'domain' => '',
        'httponly' => true,
        'secure' => !in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1', '::1'], true),
        'samesite' => 'Strict',
    ]);
    if (!session_start()) {
        http_response_code(503);
        exit('Servico indisponivel.');
    }
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
}

function emitirPedidoOrcamento(): string
{
    $agora = time();
    $_SESSION['orcamentos'] = array_filter($_SESSION['orcamentos'] ?? [],
        static fn (array $item): bool => ($item['expira'] ?? 0) > $agora);
    if (count($_SESSION['orcamentos']) >= 20) {
        array_shift($_SESSION['orcamentos']);
    }
    $pedido = bin2hex(random_bytes(16));
    $_SESSION['orcamentos'][$pedido] = ['expira' => $agora + 7200, 'avisos' => []];
    return $pedido;
}

function validarOrigemFormulario(): bool
{
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') return false;
    if (!isset($_SERVER['HTTP_ORIGIN'])) return true;
    $origem = parse_url($_SERVER['HTTP_ORIGIN']);
    if (!is_array($origem)) return false;
    $host = strtolower($origem['host'] ?? '');
    $local = ['localhost', '127.0.0.1', '[::1]'];
    $servidorLocal = in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1', '::1'], true);
    if ($servidorLocal) return in_array($host, $local, true) && in_array($origem['scheme'] ?? '', ['http', 'https'], true);
    return in_array($host, ['daianedesigner.com.br', 'www.daianedesigner.com.br'], true)
        && ($origem['scheme'] ?? '') === 'https';
}

function responderOrcamento(int $status, string $mensagem): never
{
    http_response_code($status);
    $resposta = ['success' => $status < 400, 'message' => $mensagem];
    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
    exit;
}

function validarCamposOrcamento(string $etapa, string $nome, string $telefone, string $email, int $privacidade,
    string $presenca, string $site, mixed $tipos, string $outro, string $investimento, string $prazo): void
{
    if (!preg_match("/\A[\p{L}\p{M}' .\-]{3,100}\z/u", $nome)
        || !preg_match('/\A\+?[1-9][0-9 ()\-]{7,29}\z/', $telefone)
        || !emailValido($email) || !$privacidade) {
        responderOrcamento(422, 'Confira os dados de contato e o aceite da politica.');
    }
    if ($etapa === 'rascunho') return;
    $presencas = ['Sim, já tenho um site', 'Não, ainda não tenho um site'];
    $projetos = ['Site institucional', 'Landing page', 'Loja virtual', 'Página de captura',
        'Área de membros', 'Link na Bio', 'Automação', 'Seo & Performance', 'Outro'];
    $valores = ['R$ 1.000 a R$ 2.000', 'R$ 2.500 a R$ 5.000', 'R$ 5.500 a R$ 15.000', 'Ainda não tenho um valor'];
    $prazos = ['Até 7 dias', 'Até 15 dias', 'Até 30 dias', 'Até 60 dias', 'Sem pressa / flexível'];
    if (!in_array($presenca, $presencas, true) || !is_array($tipos) || count($tipos) < 1
        || count($tipos) > count($projetos) || array_diff($tipos, $projetos)
        || !in_array($investimento, $valores, true) || !in_array($prazo, $prazos, true)
        || (in_array('Outro', $tipos, true) && strlen($outro) < 5)) {
        responderOrcamento(422, 'Confira as opcoes e os dados do projeto.');
    }
    if ($presenca === $presencas[0]) {
        $url = preg_match('~^https?://~i', $site) ? $site : 'https://' . $site;
        $partes = filter_var($url, FILTER_VALIDATE_URL) ? parse_url($url) : [];
        if (!in_array(strtolower($partes['scheme'] ?? ''), ['http', 'https'], true)
            || !str_contains($partes['host'] ?? '', '.') || isset($partes['user']) || isset($partes['pass'])) {
            responderOrcamento(422, 'Informe um link de site valido.');
        }
    }
}

function permitirNovoRascunho(string $secret, int $limite = 8): bool
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

        if ($estado[$ip]['total'] >= $limite || count($estado) > 10000) {
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

    responderOrcamento(200, $mensagem);
}
