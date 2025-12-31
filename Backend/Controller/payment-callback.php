<?php

$tx_ref = $_GET['tx_ref']; // from Chapa callback
$secretKey = "CHASECK_TEST-WfCdb1qIebMz2cWx8awCqwM3NgNfbboy";

// 1️⃣ Verify payment with Chapa
$ch = curl_init("https://api.chapa.co/v1/transaction/verify/$tx_ref");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $secretKey"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

$status = ($data['data']['status'] === 'success') ? 'paid' : 'failed';

// 2️⃣ Update ticket status in DB
$conn = new mysqli("localhost","root","","ethioevents_db");
$stmt = $conn->prepare("UPDATE tickets SET payment_status=? WHERE tx_ref=?");
$stmt->bind_param("ss", $status, $tx_ref);
$stmt->execute();
$stmt->close();

echo "Payment status updated: $status";
