<?php

$url = "https://api.open-meteo.com/v1/forecast?latitude=47.4733,47.419,46.7512&longitude=8.3059,8.2733,7.6217&current=temperature_2m,apparent_temperature,rain,showers,snowfall,cloud_cover,wind_speed_10m&timezone=Europe/Zurich&forecast_days=1";

// Initialisiert eine cURL-Sitzung
$ch = curl_init($url);

// Setzt Optionen
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Führt die cURL-Sitzung aus und erhält den Inhalt
$response = curl_exec($ch);

// Schließt die cURL-Sitzung
curl_close($ch);

// Dekodiert die JSON-Antwort
$data = json_decode($response, true);


$today = '2024-10-09'; 
$url = "https://flood-api.open-meteo.com/v1/flood?latitude=47.4733,47.419,46.7512&longitude=8.3059,8.2733,7.6217&daily=river_discharge&start_date=$today&end_date=$today";


// wasser
$today = date('Y-m-d');
$url = "https://flood-api.open-meteo.com/v1/flood?latitude=47.4733,47.419,46.7512&longitude=8.3059,8.2733,7.6217&daily=river_discharge&start_date=$today&end_date=$today";

$ch2 = curl_init($url);

// Setzt Optionen
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);

// Führt die cURL-Sitzung aus und erhält den Inhalt
$response2 = curl_exec($ch2);

// Schließt die cURL-Sitzung
curl_close($ch2);

// Dekodiert die JSON-Antwort
$data2 = json_decode($response2, true);

return ["weather" => $data, "water" => $data2];
?>

