<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

const ANALISE_ACTION = 'analise_landing';
const ANALISE_HOSTS = ['daianedesigner.com.br', 'www.daianedesigner.com.br'];

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function responder(int $status, array $dados): never
{
    http_response_code($status);
    echo json_encode(['success' => $status < 400] + $dados, JSON_UNESCAPED_UNICODE);
    exit;
}

function campo(string $nome): string
{
    $valor = $_POST[$nome] ?? '';
    if (!is_string($valor)) {
        responder(422, ['message' => 'Confira os dados do formulário.']);
    }

    return trim($valor);
}

function possuiTermoBloqueado(string $valor): bool
{
    $texto = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $valor);
    $texto = preg_replace("/['`^~\"]+/", '', $texto === false ? $valor : $texto);
    return preg_match('/teste|test|fake|falso|example|exemplo|demo|sample|asdf|qwerty/i', $texto ?? $valor) === 1;
}

/** Guarda apenas identificadores derivados e prazos fora da pasta pública. */
function atualizarLimites(callable $atualizar): bool
{
    $arquivo = sys_get_temp_dir() . '/daiane-analise-' . substr(hash('sha256', __DIR__), 0, 16) . '.json';
    $handle = fopen($arquivo, 'c+b');
    if ($handle === false) {
        throw new RuntimeException('Armazenamento de limites indisponível.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Bloqueio dos limites indisponível.');
        }

        $conteudo = stream_get_contents($handle);
        $estado = $conteudo === '' ? [] : json_decode($conteudo, true, 16, JSON_THROW_ON_ERROR);
        if (!is_array($estado)) {
            throw new RuntimeException('Estado de limites inválido.');
        }

        $agora = time();
        $estado = array_filter($estado, static fn (array $item): bool => $item['ate'] > $agora);
        $resultado = $atualizar($estado, $agora);
        $json = json_encode($estado, JSON_THROW_ON_ERROR);
        if (count($estado) > 10000 || !rewind($handle) || !ftruncate($handle, 0)
            || fwrite($handle, $json) !== strlen($json) || !fflush($handle)) {
            throw new RuntimeException('Falha ao gravar os limites.');
        }

        return $resultado;
    } finally {
        fclose($handle);
    }
}

function validarTurnstile(string $token, string $secret): bool
{
    $contexto = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\nAccept: application/json",
        'content' => http_build_query(['secret' => $secret, 'response' => $token]),
        'timeout' => 8,
        'follow_location' => 0,
    ]]);

    $resposta = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $contexto);
    if ($resposta === false) {
        throw new RuntimeException('Turnstile indisponível.');
    }

    $resultado = json_decode($resposta, true, 16, JSON_THROW_ON_ERROR);
    return ($resultado['success'] ?? false) === true
        && ($resultado['action'] ?? '') === ANALISE_ACTION
        && in_array($resultado['hostname'] ?? '', ANALISE_HOSTS, true);
}

function conectarBancoAnalise(): PDO
{
    $host = getenv('DB_HOST');
    $banco = getenv('DB_DATABASE');
    $usuario = getenv('DB_USERNAME');
    $porta = filter_var(getenv('DB_PORT') ?: '3306', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 65535]]);
    if (!$host || !$banco || !$usuario || $porta === false) {
        throw new RuntimeException('Banco de dados da análise indisponível.');
    }

    return new PDO(
        "mysql:host=$host;port=$porta;dbname=$banco;charset=utf8mb4",
        $usuario,
        getenv('DB_PASSWORD') ?: '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
}

function salvarSolicitacaoAnalise(PDO $pdo, string $nome, string $email, string $url): ?string
{
    // O bloqueio é compartilhado pelas requisições que usam o mesmo MySQL.
    $lockId = 'daiane-analise:' . substr(hash('sha256', strtolower($email)), 0, 48);
    $lock = $pdo->prepare('SELECT GET_LOCK(?, 3)');
    $lock->execute([$lockId]);
    if ((int) $lock->fetchColumn() !== 1) {
        throw new RuntimeException('Não foi possível reservar a solicitação.');
    }

    try {
        $recente = $pdo->prepare(
            'SELECT id FROM solicitacoes_analise WHERE email = ? AND criado_em >= NOW() - INTERVAL 1 HOUR LIMIT 1'
        );
        $recente->execute([$email]);
        if ($recente->fetchColumn() !== false) {
            return null;
        }

        $inserir = $pdo->prepare('INSERT INTO solicitacoes_analise (nome, email, url) VALUES (?, ?, ?)');
        $inserir->execute([$nome, $email, $url]);
        return $pdo->lastInsertId();
    } finally {
        try {
            $liberar = $pdo->prepare('SELECT RELEASE_LOCK(?)');
            $liberar->execute([$lockId]);
        } catch (Throwable $erro) {
            error_log('Análise gratuita: falha ao liberar bloqueio (' . get_class($erro) . ').');
        }
    }
}

function enviarAnalise(string $id, string $nome, string $email, string $url): void
{
    require_once dirname(__DIR__) . '/vendor/autoload.php';

    $host = getenv('SMTP_HOST');
    $usuario = getenv('SMTP_USERNAME');
    $senha = getenv('SMTP_PASSWORD');
    $porta = filter_var(getenv('SMTP_PORT'), FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 65535]]);
    if (!$host || !$usuario || !$senha || $porta === false) {
        throw new RuntimeException('SMTP indisponível.');
    }

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $usuario;
    $mail->Password = $senha;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $porta;
    $mail->Timeout = 12;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom('admin@daianeferreira.com.br', getenv('MAIL_FROM_NAME') ?: 'Daiane Designer');
    $mail->addAddress('newsletter@daianeferreira.com.br');
    $mail->addReplyTo($email, $nome);
    $mail->Subject = 'Nova solicitação de análise gratuita';
    $mail->Body = "Solicitação: #$id\nNome: $nome\nE-mail: $email\nLanding page: $url\n";
    $mail->send();
}

$metodo = $_SERVER['REQUEST_METHOD'] ?? '';
if (!in_array($metodo, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    responder(405, ['message' => 'Método inválido.']);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
    responder(413, ['message' => 'Os dados enviados excedem o tamanho permitido.']);
}

try {
    $siteKey = getenv('TURNSTILE_SITE_KEY');
    $secret = getenv('TURNSTILE_SECRET_KEY');
    if ($metodo === 'GET' && (!$siteKey || !$secret)) {
        responder(503, ['message' => 'A proteção do formulário está indisponível no momento.']);
    }

    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('DAIANEANALISE');
    session_set_cookie_params([
        'path' => '/analise-gratuita/',
        'httponly' => true,
        'secure' => !in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1', '::1'], true),
        'samesite' => 'Strict',
    ]);
    if (!session_start()) {
        throw new RuntimeException('Sessão indisponível.');
    }

    if ($metodo === 'GET') {
        $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
        $csrf = $_SESSION['csrf'];
        session_write_close();
        responder(200, ['csrf_token' => $csrf, 'turnstile_site_key' => $siteKey]);
    }

    $csrf = $_SESSION['csrf'] ?? '';
    session_write_close();
    if ($csrf === '' || !hash_equals($csrf, campo('csrf_token'))) {
        responder(403, ['message' => 'A sessão expirou. Atualize a página e tente novamente.']);
    }

    $chaveIp = 'ip:' . hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? '', $secret ?: $csrf);
    $permitido = atualizarLimites(static function (array &$estado, int $agora) use ($chaveIp): bool {
        $estado[$chaveIp] ??= ['ate' => $agora + 600, 'total' => 0];
        if ($estado[$chaveIp]['total'] >= 12) {
            return false;
        }

        $estado[$chaveIp]['total']++;
        return true;
    });
    if (!$permitido) {
        responder(429, ['message' => 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.']);
    }

    $nome = campo('nome');
    $email = campo('email');
    $url = campo('url');

    if (campo('empresa_confirmacao') !== '' || possuiTermoBloqueado($nome)
        || possuiTermoBloqueado($email) || possuiTermoBloqueado(rawurldecode($url))) {
        responder(422, ['message' => 'Informe seus dados reais para solicitar a análise.']);
    }

    if (!preg_match("/\A[\p{L}\p{M}'’.\- ]{2,80}\z/u", $nome) || !preg_match('/\p{L}/u', $nome)) {
        responder(422, ['message' => 'Digite um nome válido.']);
    }
    if (strlen($email) > 150 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        responder(422, ['message' => 'Digite um e-mail válido.']);
    }

    if ($url !== '' && !preg_match('~^[a-z][a-z0-9+.-]*://~i', $url)) {
        $url = 'https://' . $url;
    }
    $partes = strlen($url) <= 2048 && filter_var($url, FILTER_VALIDATE_URL) ? parse_url($url) : [];
    $host = $partes['host'] ?? '';
    if (!in_array(strtolower($partes['scheme'] ?? ''), ['http', 'https'], true)
        || !str_contains($host, '.') || filter_var(trim($host, '[]'), FILTER_VALIDATE_IP)
        || isset($partes['user']) || isset($partes['pass'])) {
        responder(422, ['message' => 'Digite uma URL válida para sua Landing Page.']);
    }

    $token = campo('cf-turnstile-response');
    if (!$secret || !$siteKey) {
        responder(503, ['message' => 'A proteção do formulário está indisponível no momento.']);
    }
    if ($token === '' || strlen($token) > 2048 || !validarTurnstile($token, $secret)) {
        responder(403, ['message' => 'Conclua a verificação de segurança e tente novamente.']);
    }

    $pdo = conectarBancoAnalise();
    $id = salvarSolicitacaoAnalise($pdo, $nome, $email, $url);
    if ($id === null) {
        responder(429, ['message' => 'Já existe uma solicitação recente para este e-mail.']);
    }

    $notificado = false;
    try {
        enviarAnalise($id, $nome, $email, $url);
        $notificado = true;
    } catch (Throwable $erro) {
        error_log('Análise gratuita #' . $id . ': falha ao enviar aviso (' . get_class($erro) . ').');
    }

    try {
        $coluna = $notificado ? 'email_enviado_em' : 'email_falhou_em';
        $registrarAviso = $pdo->prepare("UPDATE solicitacoes_analise SET $coluna = CURRENT_TIMESTAMP WHERE id = ?");
        $registrarAviso->execute([$id]);
    } catch (Throwable $erro) {
        error_log('Análise gratuita #' . $id . ': falha ao registrar status do aviso (' . get_class($erro) . ').');
    }

    responder(200, ['csrf_token' => $csrf]);
} catch (Throwable $erro) {
    error_log('Formulário de análise gratuita: ' . get_class($erro));
    responder(503, ['message' => 'Não foi possível enviar sua solicitação agora. Tente novamente mais tarde.']);
}
