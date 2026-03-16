<?php
// Desativa erros HTML que quebram o JSON
error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$port = 3306;
$dbname = "igrej300_eventos_ICRBF";
$user = "igrej300_phprooter";
$pass = "Avivalista26@";
$table = "conf_casais_2026_04_18";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Dados não recebidos"]);
    exit;
}

$homem = trim($data['homem'] ?? '');
$mulher = trim($data['mulher'] ?? '');
$igreja = trim($data['igreja'] ?? '');
$celula = trim($data['celula'] ?? '');
// Limpa o telefone para aceitar apenas números
$telefone = preg_replace('/\D/', '', $data['telefone'] ?? '');

// Validação de campos obrigatórios
if (!$homem || !$mulher || !$igreja || strlen($telefone) < 10) {
    echo json_encode(["status" => "error", "message" => "Preencha todos os campos corretamente."]);
    exit;
}

// Lógica da Célula
if ($igreja !== "Baixada Fluminense - (Vila Rosali)") {
    $celula = "Matriz($igreja)";
}

try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $createTable = "CREATE TABLE IF NOT EXISTS $table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome_homem VARCHAR(120) NOT NULL,
        nome_mulher VARCHAR(120) NOT NULL,
        telefone VARCHAR(15) NOT NULL,
        igreja VARCHAR(120) NOT NULL,
        celula VARCHAR(120),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($createTable);

    $sql = "INSERT INTO $table (nome_homem, nome_mulher, telefone, igreja, celula) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$homem, $mulher, $telefone, $igreja, $celula]);

    echo json_encode([
        "status" => "success",
        "message" => "Inscrição realizada",
        "whatsapp_link" => "https://chat.whatsapp.com/LNK_DO_SEU_GRUPO"
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro no banco: " . $e->getMessage()]);
}