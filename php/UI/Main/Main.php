<?php

$request_uri = strtolower($_SERVER['REQUEST_URI']);

if (strpos($request_uri, "/auth/") !== false) {
    header('Location: http://163.238.35.165/~amara/PROJECT/php/UI/Index.php');
    exit;
}

?>
<?php
$request_uri = strtolower($_SERVER['REQUEST_URI']);
$is_chat_page = !strpos($request_uri, 'signup.php');
include (strpos($request_uri, 'sessions') ? './Auth/Log/sessions.php' : (strpos($request_uri, 'home') ? './Main/Pages/Home/home.php' : './Main/Pages/Home/home.php'));
?>