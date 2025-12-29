<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$secretKey = "CHASECK_TEST-s2CZzDzkwM4y7hsfLMb45CUoaUQeAFpP";// Replace with your key

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['amount'], $input['email'], $input['title'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid input'
    ]);
    exit();
}

$chapaData = [
    'amount' => $input['amount'],
    'currency' => 'ETB',
    'email' => $input['email'],
    'first_name' => $input['first_name'] ?? '',
    'last_name' => $input['last_name'] ?? '',
    'phone_number' => $input['phone_number'] ?? '',
    'tx_ref' => 'event-' . $input['event_id'] . '-' . time(),
    'callback_url' => $input['callback_url'] ?? 'http://localhost:5173/payment-success',
    'return_url' => $input['return_url'] ?? 'http://localhost:5173/payment-success',
    'customization' => [
        'title' => $input['title'],
        'description' => 'Event Payment'
    ]
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'https://api.chapa.co/v1/transaction/initialize',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($chapaData),
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $CHAPA_SECRET_KEY,
        'Content-Type: application/json'
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

if ($httpCode === 200 && isset($result['data']['checkout_url'])) {
    echo json_encode([
        'status' => 'success',
        'data' => ['checkout_url' => $result['data']['checkout_url']]
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to initialize payment',
        'debug' => $result
    ]);
}
?>
