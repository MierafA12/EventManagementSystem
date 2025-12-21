<?php
class Database {
    private $host = "localhost";
    private $db_name = "event_management";
    private $username = "root";
    private $password = "";
    public mysqli $conn;

    public function __construct() {
        $this->conn = new mysqli(
            $this->host,
            $this->username,
            $this->password,
            $this->db_name
        );

        if ($this->conn->connect_error) {
            die(json_encode([
                "status" => "error",
                "message" => "Connection failed: " . $this->conn->connect_error
            ]));
        }
    }

    public function getConnection(): mysqli {
        return $this->conn;
    }
}
?>
