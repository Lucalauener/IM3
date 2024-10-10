<?php

// Transformations-Skript  als '230_transform.php' einbinden
$jsonDataTransform = include('transform.php');
require_once 'config.php'; // Bindet die Datenbankkonfiguration ein

// Dekodiert die JSON-Daten zu einem Array
$weatherData = json_decode($jsonDataTransform['weather'], true);
$waterData = json_decode($jsonDataTransform['water'], true);

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query mit Platzhaltern für das Einfügen von Daten
    $sql = "INSERT INTO Weather (location, temperature_celsius, rain, showers, snowfall, cloud_cover, wind_speed, kondition) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Fügt jedes Element im Array in die Datenbank ein
    foreach ($weatherData as $item) {
        $stmt->execute([
            $item['location'],
            $item['temperature_celsius'],
            $item['rain'],
            $item['showers'],
            $item['snowfall'],
            $item['cloud_cover'],
            $item['wind_speed'],
            $item['condition']
        ]);
    }

    echo "Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}

try {

    // SQL-Query mit Platzhaltern für das Einfügen von Daten
    $sql = "INSERT INTO Water (location, river_discharge, surfability_score) VALUES (?, ?, ?)";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Fügt jedes Element im Array in die Datenbank ein
    foreach ($waterData as $item) {
        $stmt->execute([
            $item['location'],
            $item['river_discharge'],
            $item['surfability_score']
        ]);
    }

    echo "Daten erfolgreich eingefügt.";
} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}