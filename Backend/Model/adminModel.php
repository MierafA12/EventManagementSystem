<?php
require_once "BaseModel.php";

class AdminModel extends BaseModel {
    public function __construct(mysqli $conn) {
        parent::__construct($conn, "users"); // ✅ pass mysqli connection first
    }

    // Example: get all admins
    public function getAdmins(): array {
        $result = $this->conn->query("SELECT * FROM users WHERE role='admin'");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
     public function getAdminById($id) {
    $stmt = $this->conn->prepare("SELECT * FROM users WHERE id = ? AND role IN ('admin', 'superadmin')");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc(); 
}
// AdminModel.php (or UserModel.php if shared)
public function updatePassword($id, $hashedPassword): bool {
    // Allow admin, superadmin, and participant to change password
    $stmt = $this->conn->prepare(
        "UPDATE users SET password=? WHERE id=? AND role IN ('admin','superadmin','participant')"
    );
    $stmt->bind_param("si", $hashedPassword, $id);
    return $stmt->execute();
}

public function getUserById($id) {
    $stmt = $this->conn->prepare("SELECT * FROM users WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}




    public function createAdmin($full_name, $username, $email, $password, $status = 'active'): bool {
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        return $this->insert([
            "full_name" => $full_name,
            "username" => $username,
            "email" => $email,
            "password" => $hashed,
            "role" => "admin",
            "status" => $status
        ]);
    }

    public function updateAdmin($id, $full_name, $username, $email, $status): bool {
        $stmt = $this->conn->prepare("UPDATE users SET full_name=?, username=?, email=?, status=? WHERE id=?");
        $stmt->bind_param("ssssi", $full_name, $username, $email, $status, $id);
        return $stmt->execute();
    }

    public function deleteAdmin($id): bool {
        $stmt = $this->conn->prepare("DELETE FROM users WHERE id=? AND role='admin'");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function updateStatus($id, $status): bool {
        $stmt = $this->conn->prepare("UPDATE users SET status=? WHERE id=? AND role='admin'");
        $stmt->bind_param("si", $status, $id);
        return $stmt->execute();
    }
    public function getEventsSummary(): array {
    $sql = "
        SELECT
            e.id,
            e.name AS event_name,
            u.full_name AS organizer,
            COUNT(ra.id) AS total_attendance
        FROM events e
        JOIN users u ON e.created_by = u.id
        LEFT JOIN registrations r ON r.event_id = e.id
        LEFT JOIN registration_attendees ra ON ra.registration_id = r.id
        GROUP BY e.id
        ORDER BY e.date DESC
    ";

    $result = $this->conn->query($sql);
    return $result->fetch_all(MYSQLI_ASSOC);
}

}

?>
