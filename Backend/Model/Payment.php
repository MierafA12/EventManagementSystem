<?php
class Payment {
    private $db;
    
    public function __construct() {
        $this->db = Database::getConnection();
    }
    
    public function create($data) {
        $sql = "INSERT INTO payments (user_id, event_id, tx_ref, amount, currency, status, quantity, payment_url, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['user_id'],
            $data['event_id'],
            $data['tx_ref'],
            $data['amount'],
            $data['currency'],
            $data['status'],
            $data['quantity'],
            $data['payment_url']
        ]);
        
        return $this->db->lastInsertId();
    }
    
    public function updateStatus($tx_ref, $status) {
        $sql = "UPDATE payments SET status = ?, updated_at = NOW() WHERE tx_ref = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$status, $tx_ref]);
    }
    
    public function getByTxRef($tx_ref) {
        $sql = "SELECT * FROM payments WHERE tx_ref = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$tx_ref]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}