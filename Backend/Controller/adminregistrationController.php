<?php

require_once "../Model/EventRegistrationModel.php";
require_once "../helpers/jwt.php";

class AdminEventController {
    private EventRegistrationModel $model;

    public function __construct(mysqli $db) {
        $this->model = new EventRegistrationModel($db);
    }

    // GET: /admin/events/registered-users
    public function getRegisteredUsersByEvent() {
        try {
            $events = $this->model->getEventsWithRegisteredUsers();

            echo json_encode([
                "success" => true,
                "events" => $events
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to load registered users"
            ]);
        }
    }
}

