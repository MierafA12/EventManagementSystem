<?php
require_once __DIR__ . "/../helpers/jwt.php";

class UserController {
    private $userModel;
    private $participantModel;


    public function updateProfile($request) {
        $headers = getallheaders();
        $payload = decodeJwtToken($headers);

        $userId = $payload['id'];
        $role = $payload['role'];

        $data = json_decode(trim($request), true);
        if (!is_array($data)) {
            return ["success" => false, "message" => "Invalid request body"];
        }

        $userUpdate = [];
        if (isset($data['username'])) $userUpdate['username'] = $data['username'];
        if (isset($data['email'])) $userUpdate['email'] = $data['email'];

        if (!empty($userUpdate)) {
            $this->userModel->updateUser($userId, $userUpdate);
        }

        if ($role === "participant") {
            $participantUpdate = [];
            if (isset($data['fullname'])) $participantUpdate['full_name'] = $data['fullname'];
            if (isset($data['dob'])) $participantUpdate['dob'] = $data['dob'];
            if (isset($data['phone'])) $participantUpdate['phone_number'] = $data['phone'];

            $participant = $this->participantModel->getByUserId($userId);

            if ($participant) {
                $this->participantModel->updateParticipant($participant['id'], $participantUpdate);
            } else {
                $this->participantModel->createParticipant(
                    $userId,
                    $data['fullname'] ?? "",
                    $data['dob'] ?? "",
                    $data['phone'] ?? ""
                );
            }
        }

        $updated = $this->getProfile();

        return [
            "success" => true,
            "message" => "Profile updated successfully",
            "profile" => $updated['profile']
        ];
    }
}
