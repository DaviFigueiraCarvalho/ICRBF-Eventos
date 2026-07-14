<?php

try {
    $pdo = new PDO(
        "mysql:host=localhost;port=3306;dbname=igrej300_eventos_ICRBF;charset=utf8mb4",
        "igrej300_phprooter",
        "Avivalista26@"
    );

    echo "Connected";
}
catch (PDOException $e) {
    echo $e->getMessage();
}