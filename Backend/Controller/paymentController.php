<?php
// ⚡ CORS Fix
header("Access-Control-Allow-Origin: http://localhost:5173"); // frontend origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Your normal POST handling starts here
header("Content-Type: application/json");

// Database connection
$conn = new mysqli("localhost", "root", "", "event_management");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}

// Example: save ticket to DB
$event_id = $data['event_id'];
$email = $data['email'];
$ticket_type = $data['ticket_type'];
$quantity = $data['quantity'];
$amount = $data['amount'];
$tx_ref = uniqid("ethioevents_");
$total_amount = $amount * $quantity;

$stmt = $conn->prepare("INSERT INTO tickets (event_id, user_email, ticket_type, quantity, total_amount, payment_status, tx_ref) VALUES (?, ?, ?, ?, ?, ?, ?)");
$status = "pending";
$stmt->bind_param("issdsss", $event_id, $email, $ticket_type, $quantity, $total_amount, $status, $tx_ref);
$stmt->execute();
$stmt->close();

// 🔹 Call Chapa API
$secretKey = "CHASECK_TEST-WfCdb1qIebMz2cWx8awCqwM3NgNfbboy"; // your test secret key
$payload = [
    "amount" => $total_amount,
    "currency" => "ETB",
    "email" => $email,
    "tx_ref" => $tx_ref,
    "callback_url" => "http://localhost/EthioEvents/Backend/public/chapa/callback.php",
    "return_url" => "http://localhost:5173/payment-success",
    "customization" => [
        "title" => "EthioEvents Ticket",
        "description" => "$ticket_type Ticket for Event $event_id"
    ]
];

$ch = curl_init("https://api.chapa.co/v1/transaction/initialize");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $secretKey",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo json_encode(["status" => "error", "message" => $err]);
} else {
    echo $response; // JSON response from Chapa API
}
