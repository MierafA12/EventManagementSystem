<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

const JWT_SECRET = "thisIsASuperSecretKey1234567890!@#$%";

function generateJwtToken($userId, $role) {
    $issuedAt = time();
    $expirationTime = $issuedAt + 3600; 

    $payload = [
        "iat" => $issuedAt,
        "exp" => $expirationTime,
        "sub" => $userId,
        "role" => $role
    ];

    return JWT::encode($payload, JWT_SECRET, 'HS256');
}

function decodeJwtToken(array $headers): array {
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        exit(json_encode([
            "success" => false,
            "message" => "Authorization header missing"
        ]));
    }

    $authHeader = $headers['Authorization'];
    $token = str_replace("Bearer ", "", $authHeader);

    try {
        $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));

        return [
            "id" => $decoded->sub,
            "role" => $decoded->role
        ];

    } catch (Exception $e) {
        http_response_code(401);
        exit(json_encode([
            "success" => false,
            "message" => "Invalid or expired token"
        ]));
    }
}
