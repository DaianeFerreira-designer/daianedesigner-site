CREATE TABLE IF NOT EXISTS solicitacoes_analise (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(150) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email_enviado_em TIMESTAMP NULL DEFAULT NULL,
    email_falhou_em TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_analise_email_data (email, criado_em),
    KEY idx_analise_email_pendente (email_enviado_em, criado_em)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
