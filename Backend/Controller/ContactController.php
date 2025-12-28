<?php

require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../Model/contactModel.php';

class ContactController {
    private ContactModel $model;

    public function __construct(ContactModel $model) {
        $this->model = $model;
    }

    public function sendMessage(array $data) {
        $eventId = $data['event_id'] ?? null;
        $targetAdminId = null;

        if ($eventId) {
            // Event message → admin who created the event
            $stmt = $this->model->getEventAdminId($eventId);
            $targetAdminId = $stmt ?? null;
        } else {
            // General message → no target admin
            $targetAdminId = null;
        }

        $success = $this->model->createMessage([
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => $data['subject'],
            'message' => $data['message'],
            'event_id' => $eventId,
            'target_admin_id' => $targetAdminId
        ]);

        return [
            "success" => $success,
            "message" => $success ? "Message sent successfully" : "Failed to send message"
        ];
    }

    public function getMessages(array $headers) {
        $decoded = decodeJwtToken($headers);
        $userId = $decoded['id'];
        $role = $decoded['role'];

        if ($role === 'superadmin') {
            // Superadmin sees only general messages
            $messages = $this->model->getGeneralMessages();
        } else {
            // Admin sees only messages targeted to them
            $messages = $this->model->getMessagesForAdmin($userId);
        }

        return [
            "success" => true,
            "messages" => $messages
        ];
    }

    public function answerMessage(array $data, array $headers) {
        $decoded = decodeJwtToken($headers);
        $adminId = $decoded['id'];

        $success = $this->model->markAsAnswered($data['contact_id'], $adminId);

        return [
            "success" => $success,
            "message" => $success ? "Message marked as answered" : "Failed to update status"
        ];
    }
}

?>
