<?php
require_once "../controller/AuthController.php";
require_once "../controller/ParticipantController.php";
require_once "../controller/AdminController.php";
require_once "../controller/statusController.php";
require_once "../controller/UserController.php";
require_once "../controller/NotificationController.php";
require_once "../Model/NotificationModel.php";
require_once "../Model/user.php";
require_once "../Model/participant.php";
require_once "../Model/adminModel.php";
require_once "../Model/statusModel.php";

$routes = [
"POST /signup" => function($db, $request) {
    $controller = new ParticipantController($db); // pass mysqli only
    return $controller->signup($request);
},

    "POST /login" => function($db, $request) {
        $userModel = new UserModel($db);
        $controller = new AuthController($userModel);
        return $controller->login($request);
    },

    "GET /admin-status" => function($db) {
        $statusModel = new StatusModel($db);
        $controller = new StatusController($statusModel);
        return $controller->getStats();
    },

    "GET /admins" => function($db) {
        $adminModel = new AdminModel($db);
        $controller = new AdminController($adminModel);
        return $controller->getAdmins();
    },

    "POST /admin/status" => function($db, $request) {
        $adminModel = new AdminModel($db);
        $controller = new AdminController($adminModel);
        return $controller->toggleStatus($request);
    },

    "POST /admin/create" => function($db, $request) {
        $adminModel = new AdminModel($db);
        $controller = new AdminController($adminModel);
        return $controller->addAdmin($request);
    },

    "POST /admin/update" => function($db, $request) {
        $adminModel = new AdminModel($db);
        $controller = new AdminController($adminModel);
        return $controller->editAdmin($request);
    },

    "POST /admin/delete" => function($db, $request) {
        $adminModel = new AdminModel($db);
        $controller = new AdminController($adminModel);
        return $controller->deleteAdmin($request);
    },
     "GET /profile" => function($db, $request) {
    $userController = new UserController(new UserModel($db), new ParticipantModel($db));
    return $userController->getProfile($request);
},
   "GET /superadmin/events" => function ($db) { 
    $controller = new AdminController(new AdminModel($db));
    return $controller->getEventsSummary();
},
"GET /notifications" => function($db, $request) {
    $model = new NotificationModel($db);
    $controller = new NotificationController($model);
    return $controller->getMyNotifications();
},

"GET /profile" => function ($db, $request) {
    $controller = new UserController(
        new UserModel($db),
        new ParticipantModel($db)
    );
    return $controller->getProfile();
},

"PUT /profile" => function ($db, $request) {
    $controller = new UserController(
        new UserModel($db),
        new ParticipantModel($db)
    );
    return $controller->updateProfile($request);
},

"GET /admin/profile" => function($db) {
    $adminModel = new AdminModel($db);
    $controller = new AdminController($adminModel);
    return $controller->getProfile(getallheaders());
},

"GET /superadmin/profile" => function($db) {
    $adminModel = new AdminModel($db);
    $controller = new AdminController($adminModel);
    return $controller->getProfile(getallheaders());
},
"POST /admin/change-password" => function($db, $requestBody) {
    $controller = new AdminController(new AdminModel($db));
    $headers = getallheaders(); // get headers inside the closure
    return $controller->changePassword($headers, $requestBody);
},

"POST /superadmin/change-password" => function($db, $requestBody) {
    $controller = new AdminController(new AdminModel($db));
    $headers = getallheaders(); // get headers inside the closure
    return $controller->changePassword($headers, $requestBody);
},
"POST /contact/send" => function($db, $requestBody) {
    $data = json_decode($requestBody, true);
    $model = new ContactModel($db);
    $controller = new ContactController($model);
    return $controller->sendMessage($data);
},

"GET /contact/messages" => function($db) {
    $model = new ContactModel($db);
    $controller = new ContactController($model);
    $headers = getallheaders(); // fetch headers from HTTP request
    return $controller->getMessages($headers);
},
"POST /user/change-password" => function($db, $requestBody) {
    $controller = new AdminController(new AdminModel($db)); // or UserModel if separated
    $headers = getallheaders();
    return $controller->changePassword($headers, $requestBody);
},


"POST /contact/answer" => function($db, $requestBody, $requestHeaders) {
    $data = json_decode($requestBody, true);
    $model = new ContactModel($db);
    $controller = new ContactController($model);
    return $controller->answerMessage($data, $requestHeaders);
},






];

?>
