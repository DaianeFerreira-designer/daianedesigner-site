<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

$pdo = new PDO(
    "mysql:host=" . getenv('DB_HOST') . ";port=" . getenv('DB_PORT') . ";dbname=" . getenv('DB_DATABASE') . ";charset=utf8mb4",
    getenv('DB_USERNAME'),
    getenv('DB_PASSWORD'),
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

$emailConfig = [
    'host' => getenv('SMTP_HOST'),
    'port' => getenv('SMTP_PORT'),
    'username' => getenv('SMTP_USERNAME'),
    'password' => getenv('SMTP_PASSWORD'),
    'from_email' => getenv('MAIL_FROM_ADDRESS'),
    'from_name' => getenv('MAIL_FROM_NAME'),
    'to_email' => getenv('MAIL_TO_ADDRESS'),
    'to_name' => getenv('MAIL_TO_NAME'),
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método inválido.']);
    exit;
}

if (
    empty($_POST['csrf_token']) ||
    empty($_SESSION['csrf_token']) ||
    !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])
) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Token inválido.'
    ]);
    exit;
}

if (!empty($_POST['statusweb'] ?? '')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Envio bloqueado.']);
    exit;
}

$stage = $_POST['stage'] ?? '';
$draftId = $_POST['draft_id'] ?? null;

$nome = trim($_POST['nome'] ?? '');
$whatsapp = trim($_POST['whatsapp'] ?? '');
$email = trim($_POST['email'] ?? '');
$empresa = trim($_POST['empresaOpcional'] ?? '');
$aceitePrivacidade = isset($_POST['aceitePrivacidade']) ? 1 : 0;

$presencaSite = trim($_POST['presenca_site'] ?? '');
$siteLink = trim($_POST['site_link'] ?? '');

$tipoProjetoArray = $_POST['tipo_projeto'] ?? [];
$tipoProjeto = is_array($tipoProjetoArray)
    ? implode(', ', $tipoProjetoArray)
    : trim($tipoProjetoArray);

$outroProjeto = trim($_POST['outro_projeto'] ?? '');
$investimentoEstimado = trim($_POST['investimento_estimado'] ?? '');
$prazoInicio = trim($_POST['prazo_inicio'] ?? '');
$instagram = trim($_POST['insta'] ?? '');
$observacao = trim($_POST['observacao'] ?? '');


function e($valor) {
    return htmlspecialchars((string)$valor, ENT_QUOTES, 'UTF-8');
}

function limparAssunto($valor) {
    $valor = trim((string)$valor);
    $valor = str_replace(["\r", "\n"], '', $valor);
    $valor = strip_tags($valor);
    return $valor !== '' ? $valor : 'Sem nome';
}

function emailValido($email) {
    $email = trim((string)$email);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $emailLower = strtolower($email);

    $palavrasBloqueadas = [
        'teste',
        'test',
        'exemplo',
        'example',
        'email',
        'fake',
        'falso'
    ];

    foreach ($palavrasBloqueadas as $palavra) {
        if (str_contains($emailLower, $palavra)) {
            return false;
        }
    }

    return true;
}

function tamanhoValido($valor, $max) {
    return mb_strlen(trim((string)$valor), 'UTF-8') <= $max;
}

function enviarEmail($emailConfig, $assunto, $corpoHtml) {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = $emailConfig['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $emailConfig['username'];
    $mail->Password = $emailConfig['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $emailConfig['port'];
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($emailConfig['from_email'], $emailConfig['from_name']);
    $mail->addAddress($emailConfig['to_email'], $emailConfig['to_name']);

    $mail->isHTML(true);
    $mail->Subject = $assunto;
    $mail->Body = $corpoHtml;

    $mail->send();
}

$nomeAssunto = limparAssunto($nome);

if (
    !tamanhoValido($nome, 100) ||
    !tamanhoValido($whatsapp, 30) ||
    !tamanhoValido($email, 150) ||
    !tamanhoValido($empresa, 150) ||
    !tamanhoValido($presencaSite, 100) ||
    !tamanhoValido($siteLink, 255) ||
    !tamanhoValido($tipoProjeto, 1000) ||
    !tamanhoValido($outroProjeto, 1000) ||
    !tamanhoValido($investimentoEstimado, 100) ||
    !tamanhoValido($prazoInicio, 100) ||
    !tamanhoValido($instagram, 150) ||
    !tamanhoValido($observacao, 12000)
) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Algum campo ultrapassou o limite permitido.'
    ]);
    exit;
}

try {

    if ($stage === 'rascunho') {
        if ($nome === '' || $whatsapp === '' || $email === '' || !$aceitePrivacidade || !emailValido($email)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Preencha os dados de e-mail corretamente.']);
            exit;
        }

        $sql = "INSERT INTO orcamentos (
            nome,
            whatsapp,
            email,
            empresa,
            aceite_privacidade,
            status_solicitacao
        ) VALUES (
            :nome,
            :whatsapp,
            :email,
            :empresa,
            :aceite_privacidade,
            'rascunho'
        )";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':nome' => $nome,
            ':whatsapp' => $whatsapp,
            ':email' => $email,
            ':empresa' => $empresa !== '' ? $empresa : null,
            ':aceite_privacidade' => $aceitePrivacidade
        ]);

        $draftId = $pdo->lastInsertId();

        $corpo = "
            <h2>Orçamento - Etapa 01</h2>
            <p><strong>ID:</strong> " . e($draftId) . "</p>
            <p><strong>Nome:</strong> " . e($nome) . "</p>
            <p><strong>WhatsApp:</strong> " . e($whatsapp) . "</p>
            <p><strong>E-mail:</strong> " . e($email) . "</p>
            <p><strong>Empresa:</strong> " . e($empresa ?: 'Não informado') . "</p>
            <p><strong>Aceite privacidade:</strong> Sim</p>
            <p><strong>Status:</strong> Rascunho</p>
        ";

        enviarEmail($emailConfig, "Orçamento - {$nomeAssunto}", $corpo);

        echo json_encode([
            'success' => true,
            'message' => 'Etapa 1 salva.',
            'draft_id' => $draftId
        ]);
        exit;
    }

    if ($stage === 'projeto_enviado') {
        if (empty($draftId)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'ID do rascunho não encontrado.']);
            exit;
        }

        $sql = "UPDATE orcamentos SET
            presenca_site = :presenca_site,
            site_link = :site_link,
            tipo_projeto = :tipo_projeto,
            outro_projeto = :outro_projeto,
            investimento_estimado = :investimento_estimado,
            prazo_inicio = :prazo_inicio,
            instagram = :instagram,
            observacao = :observacao,
            status_solicitacao = 'projeto_enviado'
        WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':presenca_site' => $presencaSite,
            ':site_link' => $siteLink !== '' ? $siteLink : null,
            ':tipo_projeto' => $tipoProjeto,
            ':outro_projeto' => $outroProjeto !== '' ? $outroProjeto : null,
            ':investimento_estimado' => $investimentoEstimado,
            ':prazo_inicio' => $prazoInicio,
            ':instagram' => $instagram !== '' ? $instagram : null,
            ':observacao' => $observacao !== '' ? $observacao : null,
            ':id' => $draftId
        ]);

        $corpo = "
            <h2>Orçamento - Etapa 02</h2>
            <p><strong>ID:</strong> " . e($draftId) . "</p>
            <p><strong>Nome:</strong> " . e($nome) . "</p>
            <p><strong>WhatsApp:</strong> " . e($whatsapp) . "</p>
            <p><strong>E-mail:</strong> " . e($email) . "</p>
            <p><strong>Empresa:</strong> " . e($empresa ?: 'Não informado') . "</p>
            <hr>
            <p><strong>Já tem site?</strong> " . e($presencaSite) . "</p>
            <p><strong>Link:</strong> " . e($siteLink ?: 'Não informado') . "</p>
            <p><strong>Tipo de projeto:</strong> " . e($tipoProjeto) . "</p>
            <p><strong>Outro projeto:</strong> " . e($outroProjeto ?: 'Não informado') . "</p>
            <p><strong>Investimento:</strong> " . e($investimentoEstimado) . "</p>
            <p><strong>Prazo:</strong> " . e($prazoInicio) . "</p>
            <p><strong>Instagram:</strong> " . e($instagram ?: 'Não informado') . "</p>
            <p><strong>Observação:</strong> " . nl2br(e($observacao ?: 'Não informado')) . "</p>
            <p><strong>Status:</strong> Projeto enviado</p>
        ";

       enviarEmail($emailConfig, "Orçamento - {$nomeAssunto}", $corpo);

        echo json_encode([
            'success' => true,
            'message' => 'Etapa 2 salva.',
            'draft_id' => $draftId
        ]);
        exit;
    }

    if ($stage === 'confirmado') {
        if (empty($draftId)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'ID do orçamento não encontrado.']);
            exit;
        }

        $sql = "UPDATE orcamentos SET
            status_solicitacao = 'confirmado'
        WHERE id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $draftId]);

        $corpo = "
            <h2>Orçamento Confirmado</h2>
            <p><strong>ID:</strong> " . e($draftId) . "</p>
            <p><strong>Nome:</strong> " . e($nome) . "</p>
            <p><strong>WhatsApp:</strong> " . e($whatsapp) . "</p>
            <p><strong>E-mail:</strong> " . e($email) . "</p>
            <p><strong>Empresa:</strong> " . e($empresa ?: 'Não informado') . "</p>
            <hr>
            <p><strong>Já tem site?</strong> " . e($presencaSite) . "</p>
            <p><strong>Link:</strong> " . e($siteLink ?: 'Não informado') . "</p>
            <p><strong>Tipo de projeto:</strong> " . e($tipoProjeto) . "</p>
            <p><strong>Outro projeto:</strong> " . e($outroProjeto ?: 'Não informado') . "</p>
            <p><strong>Investimento:</strong> " . e($investimentoEstimado) . "</p>
            <p><strong>Prazo:</strong> " . e($prazoInicio) . "</p>
            <p><strong>Instagram:</strong> " . e($instagram ?: 'Não informado') . "</p>
            <p><strong>Observação:</strong> " . nl2br(e($observacao ?: 'Não informado')) . "</p>
            <p><strong>Status:</strong> Confirmado</p>
        ";

       enviarEmail($emailConfig, "Orçamento - {$nomeAssunto}", $corpo);

        echo json_encode([
            'success' => true,
            'message' => 'Orçamento confirmado.',
            'draft_id' => $draftId
        ]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Etapa inválida.']);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao salvar no banco de dados.'
    ]);
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao enviar e-mail.']);
    exit;
}