<?php

$request_uri = strtolower($_SERVER['REQUEST_URI']);
if (strpos($request_uri, "/log/") !== false) {
    header('Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php?endpoint=sessions.php');
    exit;
}

?>

<?php
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['data']) && isset($_GET['sn'])) {
        $_SESSION[$_GET['sn']] = $_GET['data'];
        header("Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php");
    } else {
        session_destroy();
    }
} else {
    http_response_code(500);
}