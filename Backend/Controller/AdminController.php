<?php
require_once __DIR__ . '/../Model/adminModel.php';
require_once "../helpers/jwt.php";

class AdminController {
    private AdminModel $model;

    public function __construct(AdminModel $model) {
        $this->model = $model;
    }

    public function getAdmins() {
        return ["success" => true, "admins" => $this->model->getAdmins()];
    }

    public function toggleStatus($request) {
        $data = json_decode($request, true);
        $this->model->updateStatus($data['id'], $data['status']);
        return ["success" => true, "message" => "Status updated"];
    }

    public function addAdmin($request) {
        $data = json_decode($request, true);
        $this->model->createAdmin($data['full_name'], $data['username'], $data['email'], $data['password']);
        return ["success" => true, "message" => "Admin created successfully"];
    }

    public function editAdmin($request) {
        $data = json_decode($request, true);
        $this->model->updateAdmin($data['id'], $data['full_name'], $data['username'], $data['email'], $data['status']);
        return ["success" => true, "message" => "Admin updated"];
    }

    public function deleteAdmin($request) {
        $data = json_decode($request, true);
        $this->model->deleteAdmin($data['id']);
        return ["success" => true, "message" => "Admin deleted"];
    }
    public function getEventsSummary() {
    return [
        "success" => true,
        "events" => $this->model->getEventsSummary()
    ];
}
      public function getProfile(array $requestHeaders) {
        // Decode token using helper
        $decoded = decodeJwtToken($requestHeaders);
        $adminId = $decoded['id'];

        // Fetch admin by ID
        $admin = $this->model->getAdminById($adminId);
        if (!$admin) {
            return ["success" => false, "message" => "Admin not found"];
        }

        return [
            "success" => true,
            "profile" => [
                "id" => $admin['id'],
                "name" => $admin['full_name'],
                "username" => $admin['username'],
                "email" => $admin['email'],
                "role" => $admin['role'] ?? "admin",
                "status" => $admin['status'] ?? "active",
                "profileImage" => $admin['profile_image'] ?? null
            ]
        ];
    }
 // AdminController.php
public function changePassword(array $requestHeaders, string $requestBody) {
    $decoded = decodeJwtToken($requestHeaders);
    $userId = $decoded['id']; // works for admin or participant

    $data = json_decode($requestBody, true);
    $currentPassword = $data['currentPassword'] ?? '';
    $newPassword = $data['newPassword'] ?? '';

    $user = $this->model->getUserById($userId);
    if (!$user) {
        return ["success" => false, "message" => "User not found"];
    }

    if (!password_verify($currentPassword, $user['password'])) {
        return ["success" => false, "message" => "Current password is incorrect"];
    }

    $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
    $this->model->updatePassword($userId, $hashed);

    return ["success" => true, "message" => "Password changed successfully"];
}

   
}

?>
