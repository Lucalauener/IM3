<?php

if (isset($_GET['Interval'])) {
    $Interval = (int)$_GET['Interval'];  
} else {
    $Interval = 7;  
}

require_once 'config.php'; 

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $username, $password, $options);

   
    $sql = "SELECT * FROM `Water` WHERE date BETWEEN DATE_SUB(CURDATE(), INTERVAL :Interval DAY) AND CURDATE() + INTERVAL 1 DAY - INTERVAL 1 SECOND";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':Interval', $Interval, PDO::PARAM_INT);  
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC); 

    echo json_encode($data);  

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);  // Return the error in JSON format if any exception occurs
}


?>