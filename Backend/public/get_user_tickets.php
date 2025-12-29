<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include __DIR__ . "/../config/database.php";

$db = new Database();
$conn = $db->getConnection();

$email = $_GET['email'] ?? '';

if (empty($email)) {
    echo json_encode(["status" => "failed", "message" => "Email is required"]);
    exit;
}

// DEBUG: Log what we're looking for
error_log("Fetching tickets for email: " . $email);

// SIMPLE QUERY - Get tickets directly
$sql = "SELECT * FROM tickets WHERE user_email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$tickets = [];
while ($ticket = $result->fetch_assoc()) {
    // Get event details
    $eventSql = "SELECT * FROM events WHERE id = ?";
    $eventStmt = $conn->prepare($eventSql);
    $eventStmt->bind_param("i", $ticket['event_id']);
    $eventStmt->execute();
    $event = $eventStmt->get_result()->fetch_assoc();
    
    // Get attendee info
    $attendeeSql = "SELECT * FROM registration_attendees WHERE registration_id = ?";
    $attendeeStmt = $conn->prepare($attendeeSql);
    $attendeeStmt->bind_param("i", $ticket['id']);
    $attendeeStmt->execute();
    $attendees = $attendeeStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
    $tickets[] = [
        'ticket_id' => $ticket['id'],
        'event_title' => $event['title'] ?? 'Unknown Event',
        'event_date' => $event['event_date'] ?? '',
        'event_time' => $event['event_time'] ?? '',
        'event_type' => $event['eventType'] ?? 'Physical',
        'event_link' => $event['eventLink'] ?? '',
        'location' => $event['location'] ?? '',
        'ticket_type' => $ticket['ticket_type'],
        'total_amount' => $ticket['total_amount'],
        'payment_status' => $ticket['payment_status'],
        'tx_ref' => $ticket['tx_ref'],
        'ticket_code' => $ticket['ticket_code'],
        'issued_at' => $ticket['issued_at'],
        'attendees' => $attendees
    ];
}

// DEBUG: Log what we found
error_log("Found " . count($tickets) . " tickets");

echo json_encode([
    "status" => "success",
    "count" => count($tickets),
    "email" => $email,
    "data" => $tickets
]);

$stmt->close();
$conn->close();
?>