<?php
require_once DIR . "/../helpers/jwt.php";

class UserController {
    private $userModel;
    private $participantModel;

    public function __construct($userModel, $participantModel) {
        $this->userModel = $userModel;
        $this->participantModel = $participantModel;
    }

    public function getProfile() {
        $headers = getallheaders();
        $payload = decodeJwtToken($headers);

        $userId = $payload['id'];
        $role = $payload['role'];

        $user = $this->userModel->getUserById($userId);
        if (!$user) {
            return ["success" => false, "message" => "User not found"];
        }

        unset($user['password']);

        if ($role === "participant") {
            $participant = $this->participantModel->getByUserId($userId);
            if ($participant) {
                $user = array_merge($user, $participant);
            }
        }

        return [
            "success" => true,
            "profile" => $user
        ];
  }}