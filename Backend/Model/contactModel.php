<?php
class ContactModel extends BaseModel {
    public function __construct(mysqli $conn) {
        parent::__construct($conn, "contacts");
    }

    public function createMessage($data): bool {
        $stmt = $this->conn->prepare(
            "INSERT INTO contacts 
            (participant_name, participant_email, subject, message, event_id, target_admin_id) 
            VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->bind_param(
            "ssssii",
            $data['name'],
            $data['email'],
            $data['subject'],
            $data['message'],
            $data['event_id'],
            $data['target_admin_id']
        );
        return $stmt->execute();
    }

    public function markAsAnswered($contactId, $adminId): bool {
        $stmt = $this->conn->prepare(
            "UPDATE contacts SET status='answered', answered_by_admin_id=? WHERE id=?"
        );
        $stmt->bind_param("ii", $adminId, $contactId);
        return $stmt->execute();
    }

    public function getMessagesForAdmin($adminId): array {
        // Admin sees only messages targeted to them
        $stmt = $this->conn->prepare("
            SELECT * FROM contacts 
            WHERE target_admin_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->bind_param("i", $adminId);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function getGeneralMessages(): array {
        // Superadmin sees only general messages (no target)
        $stmt = $this->conn->prepare("
            SELECT * FROM contacts 
            WHERE target_admin_id IS NULL
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function getSuperAdminId(): int {
        $result = $this->conn->query("SELECT id FROM users WHERE role='superadmin' LIMIT 1");
        $row = $result->fetch_assoc();
        return $row['id'] ?? 1;
    }
}

?>
