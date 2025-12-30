<?php

class EventRegistrationModel {
    private mysqli $db;

    public function __construct(mysqli $db) {
        $this->db = $db;
    }

    // Get events with their registered users
    public function getEventsWithRegisteredUsers() {
        $sql = "
            SELECT 
                e.id AS event_id,
                e.name AS event_name,
                e.date,
                e.time,
                u.id AS user_id,
                u.full_name,
                u.email
            FROM events e
            LEFT JOIN event_registrations er ON e.id = er.event_id
            LEFT JOIN users u ON er.user_id = u.id
            ORDER BY e.id
        ";

        $result = $this->db->query($sql);

        $events = [];

        while ($row = $result->fetch_assoc()) {
            $eventId = $row['event_id'];

            if (!isset($events[$eventId])) {
                $events[$eventId] = [
                    "id" => $eventId,
                    "name" => $row['event_name'],
                    "date" => $row['date'],
                    "time" => $row['time'],
                    "registeredUsers" => []
                ];
            }

            if ($row['user_id']) {
                $events[$eventId]["registeredUsers"][] = [
                    "id" => $row['user_id'],
                    "fullName" => $row['full_name'],
                    "email" => $row['email']
                ];
            }
        }

        return array_values($events);
    }
}