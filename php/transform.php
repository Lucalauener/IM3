<?php

// Bindet das Skript 130_extract.php für Rohdaten ein
$dataExtract = include('extract.php');


$data = $dataExtract['weather'];
$data2 = $dataExtract['water'];

// Definiert Zuordnungen von Koordinaten zu Stadtnamen
$locationsMap = [
    '47.48,8.299999' => 'Baden',
    '47.42,8.279999' => 'Mellingen',
    '46.760002,7.6199994' => 'Thun',
];

$locationsMap2 = [
    '47.450005,8.300003' => 'Baden',
    '47.4,8.25' => 'Mellingen',
    '46.75,7.600006' => 'Thun',
];

// Definiert optimale Abflusswerte für jede Stadt
$optimalDischarge = [
    'Baden' => 100, // Optimum bei Baden in m³/s
    'Mellingen' => 200, // Optimum bei Mellingen in m³/s
    'Thun' => 150, // Optimum bei Thun in m³/s
];

// Definiert Minimalwerte für die Surfability-Berechnung
$minDischarge = [
    'Baden' => 50,
    'Mellingen' => 100,
    'Thun' => 75,
];

$maxDischarge = [
    'Baden' => 300,
    'Mellingen' => 400,
    'Thun' => 350,
];


// Funktion, um den Surfability-Score zu berechnen
function calculateSurfabilityScore($city, $river_discharge, $optimalDischarge, $minDischarge, $maxDischarge) {
    $optimum = $optimalDischarge ?? null;
    $minimum = $minDischarge ?? null;
    $maximum = $maxDischarge ?? null;

    // Überprüfen, ob die Stadt bekannt ist und alle Werte gesetzt sind
    if ($optimum === null || $minimum === null || $maximum === null) {
        return 'Unbekannt';
    }

    // Berechnet den Score basierend auf der Entfernung zum Optimum
    if ($river_discharge >= $minimum && $river_discharge <= $optimum) {
        // Wenn der Abfluss zwischen Minimum und Optimum liegt
        $score = 10 - round(10 * abs($river_discharge - $optimum) / ($optimum - $minimum), 0);
    } elseif ($river_discharge > $optimum && $river_discharge <= $maximum) {
        // Wenn der Abfluss zwischen Optimum und Maximum liegt
        $score = 10 - round(10 * abs($river_discharge - $optimum) / ($maximum - $optimum), 0);
    } else {
        // Wenn der Abfluss unter dem Minimum oder über dem Maximum liegt, gibt es eine niedrige Bewertung
        $score = 1;
    }

    // Stellt sicher, dass der Score zwischen 1 und 10 bleibt
    return max(1, min($score, 10));
}

// Funktion, um Fahrenheit in Celsius umzurechnen
function convertToCelsius($fahrenheit) {
    return ($fahrenheit - 32) * 5/9;
}

// Neue Funktion zur Bestimmung der Wetterbedingung
function determineCondition($cloudCover, $rain, $showers, $snowfall) {
    if ($rain > 0 || $showers > 0.2 || $snowfall > 0.2) {
        return 'regnerisch';
    } elseif ($cloudCover < 20) {
        return 'sonnig';
    } elseif ($cloudCover < 70) {
        return 'teilweise bewölkt';
    } else {
        return 'bewölkt';
    }
}

// Initialisiert Arrays, um die transformierten Daten zu speichern
$transformedData = [];
$transformedData2 = [];

// Transformiert und fügt die notwendigen Informationen für $data hinzu
foreach ($data as $location) {

    // Bestimmt den Stadtnamen anhand von Breitengrad und Längengrad
    $cityKey = $location['latitude'] . ',' . $location['longitude'];
    $city = $locationsMap[$cityKey] ?? 'Unbekannt';

    // Wandelt die Temperatur in Celsius um und rundet sie
    $temperatureCelsius = round(convertToCelsius($location['current']['temperature_2m']), 2);

    // Bestimmt die Wetterbedingung
    $condition = determineCondition(
        $location['current']['cloud_cover'],
        $location['current']['rain'],
        $location['current']['showers'],
        $location['current']['snowfall']
    );

    // Holt den Flussabflusswert (hier aus dem Beispiel: Stelle 0 im River Discharge Array)
    $riverDischarge = $location['current']['river_discharge'][0] ?? 0;

    // Konstruiert die neue Struktur mit allen angegebenen Feldern, einschließlich des neuen 'condition'-Feldes
    $transformedData[] = [
        'location' => $city,
        'temperature_celsius' => $temperatureCelsius,
        'rain' => $location['current']['rain'],
        'showers' => $location['current']['showers'],
        'snowfall' => $location['current']['snowfall'],
        'cloud_cover' => $location['current']['cloud_cover'],
        'wind_speed' => $location['current']['wind_speed_10m'],
        'condition' => $condition, // Fügt das Feld 'condition' hinzu
    ];
}

// Transformiert und fügt die notwendigen Informationen für $data2 hinzu (mit locationsMap2)
foreach ($data2 as $location) {


    // Bestimmt den Stadtnamen anhand von Breitengrad und Längengrad mit locationsMap2
    $cityKey = $location['latitude'] . ',' . $location['longitude'];
    $city = $locationsMap2[$cityKey] ?? 'Unbekannt';

    // Holt den Flussabflusswert (hier aus dem Beispiel: Stelle 0 im River Discharge Array)
    $riverDischarge = $location['daily']['river_discharge'][0];

    // Berechnet den Surfability-Score für die aktuelle Stadt
    $surfabilityScore = calculateSurfabilityScore($city, $riverDischarge, $optimalDischarge[$city], $minDischarge[$city], $maxDischarge[$city]);

    // Konstruiert die neue Struktur mit nur 'river_discharge' und 'surfability_score'
    $transformedData2[] = [
        'location' => $city,
        'river_discharge' => $riverDischarge,
        'surfability_score' => $surfabilityScore,
    ];
}

// Kodiert die transformierten Daten in JSON
$jsonData = json_encode($transformedData, JSON_PRETTY_PRINT);
$jsonData2 = json_encode($transformedData2, JSON_PRETTY_PRINT);

return ['weather' => $jsonData, 'water' => $jsonData2];

