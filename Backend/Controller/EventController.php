 <?php
require_once "../Model/eventModel.php";
require_once "../config/database.php";
require_once "../Middleware/AuthMiddleware.php";


class EventController {
    private EventModel $eventModel;

    public function __construct($conn) {
        $this->eventModel = new EventModel($conn);
    }

    // ---------------- CRUD Operations ----------------

    // Get all events
    public function getAll() {
        $events = $this->eventModel->getEvents();
        return ['success' => true, 'events' => $events];
    }

    // Get single event
    public function getOne($id) {
        $event = $this->eventModel->getEventById($id);
        return ['success' => true, 'event' => $event];
    }

    // Create event
    public function create() {
        // Handle file upload
        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $targetDir = "../uploads/";
            if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
            $fileName = time() . "_" . basename($_FILES["image"]["name"]);
            $targetFile = $targetDir . $fileName;
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
                $imagePath = $fileName;
            }
        }

        $data = $_POST;

        $this->eventModel->createEvent(
            $data['title'],
            $data['description'],
            $data['category'],
            $data['eventType'],
            $data['location'] ?? null,
            $data['eventLink'] ?? null,
            $data['datetime'],
            $data['fee'],
            $data['capacity'] ?? null,
            $imagePath
        );

        return ['success' => true, 'message' => 'Event created'];
    }

    // Update event
    public function update() {
        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $targetDir = "../uploads/";
            if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
            $fileName = time() . "_" . basename($_FILES["image"]["name"]);
            $targetFile = $targetDir . $fileName;
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
                $imagePath = $fileName;
            }
        }

        $data = $_POST;

        $this->eventModel->updateEvent(
            $data['id'],
            $data['title'],
            $data['description'],
            $data['category'],
            $data['eventType'],
            $data['location'] ?? null,
            $data['eventLink'] ?? null,
            $data['datetime'],
            $data['fee'],
            $data['capacity'] ?? null,
            $imagePath
        );

        return ['success' => true, 'message' => 'Event updated'];
    }

    // Delete event
    public function delete($id) {
        $this->eventModel->deleteEvent($id);
        return ['success' => true, 'message' => 'Event deleted'];
    }

    // ---------------- Dashboard Stats ----------------

    public function getDashboardStats() {
        $stats = $this->eventModel->fetchDashboardStats();
        return ['success' => true, 'stats' => $stats];
    }

    public function getEventTrend() {
        $trend = $this->eventModel->fetchEventTrend();
        return ['success' => true, 'eventData' => $trend];
    }

    // ---------------- Search & Filter ----------------

    public function search($query) {
        $events = $this->eventModel->searchEvents($query);
        return ['success' => true, 'events' => $events];
    }

    public function filter($filters) {
        $events = $this->eventModel->filterEvents($filters);
        return ['success' => true, 'events' => $events];
    }

    public function searchAndFilter($search, $filters) {
        $events = $this->eventModel->searchAndFilter($search, $filters);
        return ['success' => true, 'events' => $events];
    }

    public function getCategories() {
        $categories = $this->eventModel->getEventsByCategory();
        return ['success' => true, 'categories' => $categories];
    }
}

// Note: Route handling moved to AdminRoute.php
// This controller is now instantiated only when needed by the router
?>
 
