<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include DIR . "/../config/database.php";

$db = new Database();
$conn = $db->getConnection();

$event_id = $_GET['id'] ?? 0;

if (!$event_id) {
    echo json_encode(["success" => false, "message" => "Event ID is required"]);
    exit;
}

$sql = "SELECT * FROM events WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Event not found"]);
    exit;
}

$event = $result->fetch_assoc();

// Format the response
$formattedEvent = [
    "id" => $event['id'],
    "title" => $event['title'],
    "description" => $event['description'],
    "category" => $event['category'],
    "eventType" => $event['eventType'],
    "location" => $event['location'],
    "eventLink" => $event['eventLink'],
    "event_date" => $event['event_date'],
    "event_time" => $event['event_time'],
    "fee" => $event['fee'],
    "capacity" => $event['capacity'],
    "image" => $event['image'],
    "status" => $event['status']
];

echo json_encode([
    "success" => true,
    "data" => $formattedEvent
]);

$stmt->close();
$conn->close();
?>