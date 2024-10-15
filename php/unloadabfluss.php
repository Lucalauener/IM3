<?php

require_once 'config.php'; 

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);

    // Get the date and location from the GET parameters
    $date = $_GET['date'];
    
    // Sanitize input and construct SQL query
    $sql = "SELECT * FROM `Water` WHERE DATE(`date`) = :date";
    $stmt = $pdo->prepare($sql); 
    $stmt->bindParam(':date', $date);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC); 

    echo json_encode($data);  

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);  // Return the error in JSON format if any exception occurs
}

?>