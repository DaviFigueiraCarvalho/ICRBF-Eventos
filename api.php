<?php
// Desativa erros HTML que quebram o JSON
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$port = 3306;
$dbname = "igrej300_eventos_ICRBF";
$user = "igrej300_phprooter";
$pass = "Avivalista26@";
$table = "EBF_2026";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Dados não recebidos"]);
    exit;
}

// Receber e sanitizar dados
$nome_completo = trim($data['nome'] ?? '');
$data_nascimento = trim($data['data_nascimento'] ?? '');
$idade = isset($data['idade']) ? (int)$data['idade'] : 0;
$responsaveis = trim($data['responsaveis'] ?? '');
$telefone = trim($data['telefone'] ?? '');
$possui_restricao = trim($data['possui_restricao'] ?? 'nao');
$restricoes = trim($data['restricoes'] ?? '');
$possui_necessidades = trim($data['possui_necessidades'] ?? 'nao');
$necessidades = trim($data['necessidades'] ?? '');
$igreja = trim($data['igreja'] ?? '');
$outra_igreja = trim($data['outra_igreja'] ?? '');
$autorizacao_imagem = trim($data['autorizacao_imagem'] ?? 'nao');

// Validação de campos obrigatórios
if (!$nome_completo || !$data_nascimento || !$responsaveis || !$telefone || !$igreja) {
    echo json_encode(["status" => "error", "message" => "Preencha todos os campos obrigatórios."]);
    exit;
}

// Validação da autorização de imagem
if ($autorizacao_imagem !== 'sim') {
    echo json_encode(["status" => "error", "message" => "Você deve autorizar o uso de imagem da criança."]);
    exit;
}

// Validação de igreja "Outra"
if ($igreja === 'Outra' && !$outra_igreja) {
    echo json_encode(["status" => "error", "message" => "Informe o nome da igreja que frequenta."]);
    exit;
}

try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");

    // Criar tabela se não existir
    $createTable = "CREATE TABLE IF NOT EXISTS `$table` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome_completo VARCHAR(120) NOT NULL,
        data_nascimento DATE NOT NULL,
        idade INT NOT NULL,
        responsaveis VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        possui_restricao ENUM('sim', 'nao') NOT NULL DEFAULT 'nao',
        restricoes TEXT,
        possui_necessidades ENUM('sim', 'nao') NOT NULL DEFAULT 'nao',
        necessidades TEXT,
        igreja VARCHAR(120) NOT NULL,
        outra_igreja VARCHAR(255),
        autorizacao_imagem ENUM('sim', 'nao') NOT NULL DEFAULT 'nao',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($createTable);

    // Inserir dados usando prepared statement
    $sql = "INSERT INTO `$table` (
        nome_completo, 
        data_nascimento, 
        idade, 
        responsaveis, 
        telefone, 
        possui_restricao, 
        restricoes, 
        possui_necessidades, 
        necessidades, 
        igreja, 
        outra_igreja, 
        autorizacao_imagem
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $nome_completo,
        $data_nascimento,
        $idade,
        $responsaveis,
        $telefone,
        $possui_restricao,
        $restricoes,
        $possui_necessidades,
        $necessidades,
        $igreja,
        $outra_igreja,
        $autorizacao_imagem
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Inscrição realizada com sucesso!"
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro no banco de dados: " . $e->getMessage()]);
}