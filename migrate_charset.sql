-- ============================================================
-- Migração para utf8mb4 — execute no MySQL Workbench
-- Banco: igrej300_eventos_ICRBF
-- Tabela: Corrida-5-anos-05-26
-- ============================================================

-- 1. Converter o banco de dados para utf8mb4
ALTER DATABASE `igrej300_eventos_ICRBF`
    CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- 2. Converter a tabela para utf8mb4
ALTER TABLE `igrej300_eventos_ICRBF`.`Corrida-5-anos-05-26`
    CONVERT TO CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 3. (Opcional) Ajustar colunas individualmente, caso necessário
ALTER TABLE `igrej300_eventos_ICRBF`.`Corrida-5-anos-05-26`
    MODIFY COLUMN `nome`   VARCHAR(120) NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    MODIFY COLUMN `igreja` VARCHAR(120) NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    MODIFY COLUMN `celula` VARCHAR(120)           CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    MODIFY COLUMN `camisa` VARCHAR(10)  NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Verificar o resultado
SHOW CREATE TABLE `igrej300_eventos_ICRBF`.`Corrida-5-anos-05-26`;
