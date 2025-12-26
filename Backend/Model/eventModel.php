<?php

class EventModel {
    private mysqli $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // ---------------- CRUD ----------------

    public function getEvents() {
        $result = $this->conn->query("SELECT * FROM events ORDER BY event_date ASC, event_time ASC");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getEventById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM events WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function createEvent($title, $desc, $category, $eventType, $loc, $eventLink, $datetime, $fee, $capacity, $image = null) {
        $date = date('Y-m-d', strtotime($datetime));
        $time = date('H:i:s', strtotime($datetime));

        $stmt = $this->conn->prepare("
            INSERT INTO events(title, description, category, eventType, location, eventLink, event_date, event_time, fee, capacity, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "ssssssssdis",
            $title,
            $desc,
            $category,
            $eventType,
            $loc,
            $eventLink,
            $date,
            $time,
            $fee,
            $capacity,
            $image
        );
        $stmt->execute();
    }

    public function updateEvent($id, $title, $desc, $category, $eventType, $loc, $eventLink, $datetime, $fee, $capacity, $image = null) {
        $date = date('Y-m-d', strtotime($datetime));
        $time = date('H:i:s', strtotime($datetime));

        if ($image !== null) {
            // Update including image
            $stmt = $this->conn->prepare("
                UPDATE events
                SET title=?, description=?, category=?, eventType=?, location=?, eventLink=?, event_date=?, event_time=?, fee=?, capacity=?, image=?
                WHERE id=?
            ");
            $stmt->bind_param(
                "ssssssssdisi",
                $title,
                $desc,
                $category,
                $eventType,
                $loc,
                $eventLink,
                $date,
                $time,
                $fee,
                $capacity,
                $image,
                $id
            );
        } else {
            // Update without touching image
            $stmt = $this->conn->prepare("
                UPDATE events
                SET title=?, description=?, category=?, eventType=?, location=?, eventLink=?, event_date=?, event_time=?, fee=?, capacity=?
                WHERE id=?
            ");
            $stmt->bind_param(
                "ssssssssdii",
                $title,
                $desc,
                $category,
                $eventType,
                $loc,
                $eventLink,
                $date,
                $time,
                $fee,
                $capacity,
                $id
            );
        }

        $stmt->execute();
    }

    public function deleteEvent($id) {
        $stmt = $this->conn->prepare("DELETE FROM events WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
    }

    // ---------------- Dashboard ----------------

    public function fetchDashboardStats() {
        $total = $this->conn->query("SELECT COUNT(*) AS total FROM events")->fetch_assoc()['total'];
        $upcoming = $this->conn->query("SELECT COUNT(*) AS upcoming FROM events WHERE CONCAT(event_date, ' ', event_time) > NOW()")->fetch_assoc()['upcoming'];
        $past = $this->conn->query("SELECT COUNT(*) AS past FROM events WHERE CONCAT(event_date, ' ', event_time) <= NOW()")->fetch_assoc()['past'];

        return [
            "totalEvents" => (int)$total,
            "upcomingEvents" => (int)$upcoming,
            "pastEvents" => (int)$past
        ];
    }

    public function fetchEventTrend() {
        $result = $this->conn->query("
            SELECT MONTHNAME(event_date) AS month, COUNT(*) AS events
            FROM events
            WHERE YEAR(event_date) = YEAR(CURDATE())
            GROUP BY MONTH(event_date)
            ORDER BY MONTH(event_date)
        ");
        $trend = [];
        while ($row = $result->fetch_assoc()) {
            $trend[] = [
                "month" => $row['month'],
                "events" => (int)$row['events']
            ];
        }
        return $trend;
    }

    // ---------------- Search & Filter ----------------

    public function searchEvents($query) {
        $searchTerm = "%" . $this->conn->real_escape_string($query) . "%";
        $stmt = $this->conn->prepare("
            SELECT * FROM events 
            WHERE title LIKE ? OR description LIKE ?
            ORDER BY event_date ASC, event_time ASC
        ");
        $stmt->bind_param("ss", $searchTerm, $searchTerm);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function filterEvents($filters) {
        $conditions = [];
        $params = [];
        $types = "";

        if (!empty($filters['category'])) {
            $conditions[] = "category = ?";
            $params[] = $filters['category'];
            $types .= "s";
        }

        if (!empty($filters['eventType'])) {
            $conditions[] = "eventType = ?";
            $params[] = $filters['eventType'];
            $types .= "s";
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'upcoming') {
                $conditions[] = "CONCAT(event_date, ' ', event_time) > NOW()";
            } elseif ($filters['status'] === 'past') {
                $conditions[] = "CONCAT(event_date, ' ', event_time) <= NOW()";
            }
        }

        if (!empty($filters['startDate'])) {
            $conditions[] = "event_date >= ?";
            $params[] = $filters['startDate'];
            $types .= "s";
        }

        if (!empty($filters['endDate'])) {
            $conditions[] = "event_date <= ?";
            $params[] = $filters['endDate'];
            $types .= "s";
        }

        $sql = "SELECT * FROM events";
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }
        $sql .= " ORDER BY event_date ASC, event_time ASC";

        if (!empty($params)) {
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        } else {
            return $this->conn->query($sql)->fetch_all(MYSQLI_ASSOC);
        }
    }

    public function searchAndFilter($search, $filters) {
        $conditions = [];
        $params = [];
        $types = "";

        if (!empty($search)) {
            $searchTerm = "%" . $this->conn->real_escape_string($search) . "%";
            $conditions[] = "(title LIKE ? OR description LIKE ?)";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= "ss";
        }

        if (!empty($filters['category'])) {
            $conditions[] = "category = ?";
            $params[] = $filters['category'];
            $types .= "s";
        }

        if (!empty($filters['eventType'])) {
            $conditions[] = "eventType = ?";
            $params[] = $filters['eventType'];
            $types .= "s";
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'upcoming') {
                $conditions[] = "CONCAT(event_date, ' ', event_time) > NOW()";
            } elseif ($filters['status'] === 'past') {
                $conditions[] = "CONCAT(event_date, ' ', event_time) <= NOW()";
            }
        }

        if (!empty($filters['startDate'])) {
            $conditions[] = "event_date >= ?";
            $params[] = $filters['startDate'];
            $types .= "s";
        }

        if (!empty($filters['endDate'])) {
            $conditions[] = "event_date <= ?";
            $params[] = $filters['endDate'];
            $types .= "s";
        }

        $sql = "SELECT * FROM events";
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }
        $sql .= " ORDER BY event_date ASC, event_time ASC";

        if (!empty($params)) {
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        } else {
            return $this->conn->query($sql)->fetch_all(MYSQLI_ASSOC);
        }
    }

    public function getEventsByCategory() {
        $result = $this->conn->query("
            SELECT category, COUNT(*) AS count
            FROM events
            GROUP BY category
            ORDER BY count DESC
        ");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
