<?php
require_once __DIR__ . '/../Model/adminModel.php';

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
}
?>
